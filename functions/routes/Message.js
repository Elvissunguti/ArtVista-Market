const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Model/User");
const Profile = require("../Model/Profile");
const { admin, db } = require("../Utils/Firebase");


// Route to post a new message
router.post(
  "/create/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { content } = req.body;
      const userId = req.user._id;
      const artistId = req.params.artistId;

      // Create and save the new message to Firestore
      const newMessageRef = db.collection("messages").doc();
      const newMessage = {
        content,
        userId,
        artistId,
        timeStamp: admin.firestore.FieldValue.serverTimestamp(),
      };
      await newMessageRef.set(newMessage);

      // Send response back to the client
      res.json({ newMessage: { ...newMessage, id: newMessageRef.id } });
    } catch (error) {
      console.error("Error creating a new message", error);
      res.json({ error: "Error creating a new message" });
    }
  }
);

// Real-time Firestore listener: Fetch messages and listen for updates
router.get(
  "/sent/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const artistId = req.params.artistId;
      const userId = req.user._id;

      // Listen for changes to the 'messages' collection in Firestore
      const messagesQuery = db
        .collection("messages")
        .where("userId", "in", [userId, artistId])
        .where("artistId", "in", [userId, artistId])
        .orderBy("timeStamp", "asc");

      // Listen for real-time updates in Firestore
      messagesQuery.onSnapshot(async (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          content: doc.data().content,
          timeStamp: doc.data().timeStamp.toDate(),
          senderId: doc.data().userId,
        }));

        // Fetch profile data of both the user and artist from MongoDB
        const users = await User.find({ _id: { $in: [userId, artistId] } }, { userName: 1 });
        const profiles = await Profile.find(
          { userId: { $in: [userId, artistId] }, profilePic: { $exists: true } },
          { userId: 1, profilePic: 1 }
        );

        // Map profiles to user IDs for easy lookup
        const profilesMap = users.reduce((map, user) => {
          const profile = profiles.find(p => p.userId.toString() === user._id.toString());
          map[user._id] = {
            userName: user.userName,
            profilePic: profile ? profile.profilePic : null,
          };
          return map;
        }, {});

        // Format the messages with user profile data
        const formattedMessages = messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          timeStamp: msg.timeStamp,
          sender: {
            id: msg.senderId,
            userName: (profilesMap[msg.senderId] && profilesMap[msg.senderId].userName) || "Unknown",
            profilePic: (profilesMap[msg.senderId] && profilesMap[msg.senderId].profilePic) || null,

          },
        }));

        res.json({ data: formattedMessages });
      });
    } catch (error) {
      console.error("Error fetching messages with profile data", error);
      res.json({ error: "Error fetching messages" });
    }
  }
);

// Route to fetch all users the current user has communicated with, along with their profiles
router.get(
  "/get/chat",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;

      // Listen for all messages where the user is either the sender or receiver
      const userMessagesQuery = db
        .collection("messages")
        .where("userId", "in", [userId]);

      // Listen for real-time updates in Firestore
      userMessagesQuery.onSnapshot(async (snapshot) => {
        const artistIds = [...new Set(snapshot.docs.map(doc => doc.data().artistId))];

        if (artistIds.length === 0) {
          return res.json({ data: [] });
        }

        // Fetch user details and profile pictures from MongoDB
        const usersDetails = await User.find({ _id: { $in: artistIds } }, { userName: 1 });
        const profilesDetails = await Profile.find(
          { userId: { $in: artistIds }, profilePic: { $exists: true } },
          { userId: 1, profilePic: 1 }
        );

        // Combine user and profile data for response
        const userProfiles = usersDetails.map(user => {
          const profile = profilesDetails.find(p => p.userId.toString() === user._id.toString());
          return {
            artistId: user._id,
            userName: user.userName,
            profilePic: profile ? profile.profilePic : null,
          };
        });

        res.json({ data: userProfiles });
      });
    } catch (error) {
      console.error("Error fetching chats", error);
      res.json({ error: "Error fetching chat" });
    }
  }
);

module.exports = router;
