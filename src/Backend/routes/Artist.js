const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Model/User");
const ArtWork = require("../Model/ArtWork");
const Profile = require("../Model/Profile");


router.get("/allartist",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const artists = await User.find({}, 'userName');

        const artistInfo = await Promise.all(artists.map( async (artist) => {
            const artistId = artist._id;
            const artWorkCount = await ArtWork.countDocuments({ userId: artistId})

            return {
                artist: artist.userName,
                artWorkCount : artWorkCount
            };
        }));

        return res.json({ data: artistInfo });


    } catch (error){
        console.error("Error fetching the name of all the artist", error);
        return res.json({ error: "Error fetcing the name of all the artist"})
    }
})

router.get("/get/artist",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const artist = await User.find({}, 'userName');

        const artistInfo = await Promise.all(artist.map( async (artist) => {
            const artistId = artist._id;
          
            const profile = await Profile.findOne({ userId: artistId });

            const profilePic = profile ? profile.profilePic : null;

            return {
                userName: artist.userName,
                profilePic: profilePic.replace("../../../public", ""),
                artistId,
            }
        }))
        
        return res.json({ data: artistInfo })

    } catch (error){
        console.error("Error fetching artist details", error);
        return res.json({ error: "Error fetching the details of the artist"});
    }
})

module.exports = router