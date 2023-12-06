const { Types } = require("mongoose");
const mongoose = require("mongoose");

const Message = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        default: Date.now
    },
    userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
    }
});

const MessageModel = mongoose.model("Message", Message);

module.exports = MessageModel;