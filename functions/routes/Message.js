const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Model/User");
const Profile = require("../Model/Profile");
const { admin, db } = require("../Utils/Firebase");
const mongoose = require("mongoose");

// Route to post a new message
router.post(
  "/create/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { content, timeStamp } = req.body;
      const senderId = req.user._id.toString();
      const artistId = req.params.artistId.toString();

      const participants = [senderId, artistId].sort();
      const chatId = participants.join("_");

      const newMessageRef = admin.firestore().collection("messages").doc();
      const newMessage = {
        content,
        senderId,
        chatId,
        chatParticipants: participants,
        timeStamp,
      };

      await newMessageRef.set(newMessage);

      res.json({
        success: true,
        newMessage: {
          ...newMessage,
          id: newMessageRef.id,
        },
      });
    } catch (error) {
      console.error("Error creating a new message", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  }
);

// Route to fetch messages between current user and artist
router.get(
  "/sent/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const artistId = req.params.artistId.toString();
      const currentUserId = req.user._id.toString();

      const participants = [currentUserId, artistId].sort();
      const chatId = participants.join("_");

      const messagesSnapshot = await db
        .collection("messages")
        .where("chatId", "==", chatId)
        .orderBy("timeStamp", "asc")
        .get();

      const messages = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timeStamp: doc.data().timeStamp?.toDate() || null,
      }));

      const userIds = [currentUserId, artistId];

      const users = await User.find(
        { _id: { $in: userIds } },
        { userName: 1 }
      );

      const profiles = await Profile.find(
        { userId: { $in: userIds }, profilePic: { $exists: true } },
        { userId: 1, profilePic: 1 }
      );

      const userProfileMap = users.reduce((acc, user) => {
        const profile = profiles.find(p => p.userId.toString() === user._id.toString());
        acc[user._id.toString()] = {
          userName: user.userName,
          profilePic: profile ? profile.profilePic : null,
        };
        return acc;
      }, {});

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        timeStamp: msg.timeStamp,
        sender: {
          id: msg.senderId,
          userName: userProfileMap[msg.senderId]?.userName || "Unknown",
          profilePic: userProfileMap[msg.senderId]?.profilePic || null,
        },
      }));

      res.json({ data: formattedMessages });
    } catch (error) {
      console.error("Error fetching messages with profile data", error);
      res.status(500).json({ error: "Error fetching messages" });
    }
  }
);

// Route to fetch all chat artists the current user has messaged


router.get(
  "/get/chat",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id.toString();

      // 1. Query Firestore using strings only
      const messagesSnapshot = await db
      .collection("messages")
      .where("chatParticipants", "array-contains", userId)
      .get();

      // 2. Extract other participant IDs (also strings)
      const artistIds = [...new Set(
        messagesSnapshot.docs
          .map(doc => {
            const participants = doc.data().chatParticipants || [];
            return participants.find(p => p !== userId);
          })
          .filter(Boolean)
      )];
      

      if (artistIds.length === 0) {
        return res.json({ data: [] });
      }

      // 3. Convert to ObjectIds for MongoDB queries
      const objectIds = artistIds.map(id => new mongoose.Types.ObjectId(id));

      // 4. Query MongoDB
      const usersDetails = await User.find(
        { _id: { $in: objectIds } },
        { userName: 1 }
      );

      const profilesDetails = await Profile.find(
        { userId: { $in: objectIds }, profilePic: { $exists: true } },
        { userId: 1, profilePic: 1 }
      );

      const userProfiles = usersDetails.map(user => {
        const profile = profilesDetails.find(
          p => p.userId === user._id
        );
        return {
          artistId: user._id,
          userName: user.userName,
          profilePic: profile ? profile.profilePic : null,
        };
      });

      res.json({ data: userProfiles });
    } catch (error) {
      console.error("Error fetching chats", error);
      res.status(500).json({ error: "Error fetching chat" });
    }
  }
);


module.exports = router;
