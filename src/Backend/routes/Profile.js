const express = require("express");
const { profilePicUploads } = require("../Middleware/Profile");
const Profile = require("../Model/Profile");
const passport = require("passport");
const router = express.Router();

router.post("/create",
passport.authenticate("jwt", {session: false}),
(req, res) => {
    profilePicUploads(req, res, async (err) => {
        if(err){
            return res.json({ err: "Failed to upload files" });
        };

    try{
        const { description, location } = req.body;

        const profilePic = req.files["profilePic"][0].path;
        const userId = req.user._id;

        const newProfile = new Profile({
            description,
            location,
            profilePic,
            userId
        });

        await newProfile.save();
        return res.json({ message: "Profile created successfully" })
    } catch (error){
        console.error("Error creating user profile", error)
        return res.json({ Error: "Error creating user profile"})
    }
})
}); 

module.exports = router;