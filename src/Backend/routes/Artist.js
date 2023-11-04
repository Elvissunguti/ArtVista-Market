const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Model/User");
const ArtWork = require("../Model/ArtWork");



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

module.exports = router