const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwtUtils = require("../Utils/Helpers"); // Token helpers
const Message = require("../Model/Message");
const { wss, clients } = require("../routes/WebSocketServer"); // WebSocket server logic

// Middleware for verifying JWT token
const verifyJwtToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Token in "Bearer <token>" format

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }

  const decodedToken = jwtUtils.verifyToken(token);

  if (!decodedToken) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = decodedToken; // Attach decoded user to request
  next();
};

// Router to post a new message
router.post(
  "/create/:artistId",
  verifyJwtToken, // Verify token middleware
  async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.user.identifier; // User ID from decoded token
      const artistId = req.params.artistId;

      // Save the message to Firestore
      const newMessage = {
        content,
        userId,
        artistId,
        timeStamp: Timestamp.now(),
      };

      await Message.add(newMessage);

      // Find connected sockets for the artist and user
      const artistSocket = clients.get(artistId);
      const userSocket = clients.get(userId);

      // Emit the message to the relevant sockets (WebSocket communication)
      if (artistSocket) {
        wss.to(artistSocket.id).emit("newMessage", newMessage);
      }

      if (userSocket) {
        wss.to(userSocket.id).emit("newMessage", newMessage);
      }

      res.json({ newMessage });
    } catch (error) {
      console.error("Error creating a new message", error);
      return res.json({ error: "Error creating a new message" });
    }
  }
);

// Router to fetch all sent messages
router.get(
  "/sent/:artistId",
  verifyJwtToken, // Verify token middleware
  async (req, res) => {
    try {
      const artistId = req.params.artistId;
      const userId = req.user.identifier;

      // Fetch messages from Firestore
      const messagesSnapshot = await Message
        .where("userId", "in", [userId, artistId])
        .where("artistId", "in", [userId, artistId])
        .orderBy("timeStamp", "asc")
        .get();

      const messages = messagesSnapshot.docs.map(doc => {
        const message = doc.data();
        return {
          content: message.content,
          timeStamp: message.timeStamp.toDate(),
          role: message.userId === userId ? "sender" : "receiver",
        };
      });

      res.json({ data: messages });
    } catch (error) {
      console.error("Error fetching messages", error);
      res.json({ error: "Error fetching messages" });
    }
  }
);

// Router to fetch all the users and messages the user has sent or received
router.get(
  "/get/chat",
  verifyJwtToken, // Verify token middleware
  async (req, res) => {
    try {
      const userId = req.user.identifier;

      // Get all users in the chat with the current user
      const userMessagesSnapshot = await Message
        .where("userId", "==", userId)
        .get();

      const userChats = userMessagesSnapshot.docs.map(doc => {
        const message = doc.data();
        return message.artistId;
      });

      // Remove duplicates and fetch user details for each artistId
      const uniqueArtistIds = [...new Set(userChats)];

      const usersDetails = await User.find({
        _id: { $in: uniqueArtistIds },
      });

      res.json({ data: usersDetails });
    } catch (error) {
      console.error("Error fetching chats", error);
      res.json({ error: "Error fetching chats" });
    }
  }
);

module.exports = router;
