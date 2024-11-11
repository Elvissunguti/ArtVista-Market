const  mongoose  = require("mongoose");


const Profile = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    }
});

const ProfileModel = mongoose.model("Profile", Profile);

module.exports = ProfileModel;