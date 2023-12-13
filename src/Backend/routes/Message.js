const express = require("express");
const router = express.Router();
const Message = require("../Model/Message");
const passport = require("passport");
const createWebSocketServer = require("../routes/WebSocketServer");

const { wss, clients } = createWebSocketServer();

router.post(
  "/create/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.user._id;
      const artistId = req.params.artistId;

      const newMessage = new Message({ content, userId, artistId });

      await newMessage.save();

      const artistSocket = clients.get(artistId); 
      const userSocket = clients.get(userId);

      if (artistSocket) {
        artistSocket.send(JSON.stringify({ newMessage }));
      }

      if (userSocket) {
        userSocket.send(JSON.stringify({ newMessage }));
      }

      res.json({ newMessage });
    } catch (error) {
      console.error("Error creating a new message", error);
      return res.json({ error: "Error creating a new message" });
    }
  }
);

module.exports = router;
