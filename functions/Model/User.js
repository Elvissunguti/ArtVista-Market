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
        
    },
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ArtWork"
        }
    ],
    wishListNumber: {
        type: Number,
        default: 0, 
      },
    cartList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ArtWork"
        }
    ],
    cartListNumber: {
        type: Number,
        default: 0
    },

});

const UserModel = mongoose.model("User", User);

module.exports = UserModel;
