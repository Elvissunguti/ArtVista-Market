const express = require("express");
const { profilePicUploads } = require("../Middleware/Profile");
const Profile = require("../Model/Profile");
const passport = require("passport");
const User = require("../Model/User");
const router = express.Router();

router.post("/create", 
passport.authenticate("jwt", { session: false }), 
async (req, res) => {
    profilePicUploads(req, res, async (err) => {
        if (err) {
            return res.json({ err: "Failed to upload files" });
        }

        try {
            const { description, location } = req.body;
            const profilePic = req.body.profilePic
            const userId = req.user._id;

            // Check if a profile already exists for the user
            const existingProfile = await Profile.findOne({ userId });

            if (existingProfile) {
                // If a profile exists, update it
                existingProfile.description = description;
                existingProfile.location = location;
                existingProfile.profilePic = profilePic;
                await existingProfile.save();
                return res.json({ message: "Profile updated successfully" });
            } else {
                // If no profile exists, create a new one
                const newProfile = new Profile({
                    description,
                    location,
                    profilePic,
                    userId
                });
                await newProfile.save();
                return res.json({ message: "Profile created successfully" });
            }
        } catch (error) {
            console.error("Error creating or updating user profile", error);
            return res.json({ error: "Error creating or updating user profile" });
        }
    });
});


router.get("/get/profile",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{
        const userId = req.user._id;

        const profile = await Profile.findOne({userId});

        return res.json({ data: profile});

    } catch (error){
        console.error("Error fetching user's profile", error);
        return res.json({ Error: "Error fetching profile" });
    }
});


router.get("/:artistId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const artistId = req.params.artistId;

        const profile = await Profile.findOne({userId: artistId});

        const user = await User.findOne({_id: artistId});

        const userName = user.userName;
        const userId = user._id;

        let profilePic = null;

        if (profile && profile.profilePic) {
            profilePic = profile.profilePic.replace("../../../public", "");
        }

        const profileInfo = {
            userId,
            profilePic,
            userName,
        }

        return res.json({ data: profileInfo})

    } catch(error){
        console.error("Error fetching profile of the artist", error);
        return res.json({ Error: "Error fetching profile of the artist" });
    }
});

module.exports = router;
