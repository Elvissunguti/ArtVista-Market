const express = require("express");
const router = express.Router();
const Message = require("../Model/Message");
const passport = require("passport");
const createWebSocketServer = require("../routes/WebSocketServer");
const User = require("../Model/User");
const Profile = require("../Model/Profile");

const { wss, clients } = createWebSocketServer();

// router to post a new message
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

// router to fetch all sent messages
router.get("/sent/:artistId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
  try{
    const artistId = req.params.artistId;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { userId: userId, artistId: artistId },
        { userId: artistId, artistId: userId }
      ]
    }).sort({ timeStamp: 'asc' });

    const formattedMessages = messages.map(message => {
      return {
        content: message.content,
        timeStamp: message.timeStamp,
        role: message.userId.toString() === userId.toString() ? 'sender' : 'receiver'
      };
    });
        

    res.json({ data: formattedMessages });

  } catch (error){
    console.error("Error fetching messages", error);
    res.json({ error: "Error fetching messages" });
  }
});

//router to fetch all the user and the messages i have sent or received
router.get("/get/chat",
  passport.authenticate("jwt", { session: false }), 
  async (req, res) => {
    try {
      const userId = req.user._id;

      const userMessages = await Message.find({
        $or: [
          { userId: userId },
          { artistId: userId }
        ]
      });

      if (!userMessages || userMessages.length === 0) {
        return res.json({ data: [] });
      }

      const uniqueUserIds = [...new Set(userMessages.flatMap((msg) => [msg.userId, msg.artistId]))];

      // Remove the current user from the list of uniqueUserIds
      const indexToRemove = uniqueUserIds.indexOf(userId);
      if (indexToRemove !== -1) {
        uniqueUserIds.splice(indexToRemove, 1);
      }

      if (!uniqueUserIds || uniqueUserIds.length === 0) {
        return res.json({ data: [] });
      }

      // Exclude the current user from the list of fetched user details
      const usersDetails = await User.find({ _id: { $in: uniqueUserIds, $ne: userId } }, { userName: 1 });

      const profilesDetails = await Profile.find({ userId: { $in: uniqueUserIds } }, { profilePic: 1 });

      const userProfiles = usersDetails.map((user) => {
        const profile = profilesDetails.find((profile) => profile && profile.userId && profile.userId.equals(user._id));
        return {
          userId: user._id,
          userName: user.userName,
          profilePic: profile ? profile.profilePic : null,
        };
      });

      return res.json({ data: userProfiles });

    } catch (error) {
      console.error("Error fetching chats", error);
      res.json({ error: "Error fetching chat" });
    }
  });




module.exports = router;
