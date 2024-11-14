const mongoose = require("mongoose");

// Define the Message Schema for MongoDB validation and structure
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Assuming artist is also a User
      required: true,
    },
    timeStamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Export the model for MongoDB, but Firestore is used for actual data storage
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
