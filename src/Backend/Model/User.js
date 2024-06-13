const mongoose  = require("mongoose");

const User = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
      },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "artWork"
        }
    ],
    wishListNumber: {
        type: Number,
        default: 0, 
      },
    cartList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "artWork"
        }
    ],
    cartListNumber: {
        type: Number,
        default: 0
    },

});

const UserModel = mongoose.model("User", User);

module.exports = UserModel;
