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

        const artistsWithArtwork = await User.find({
            _id: {
                $in: await ArtWork.distinct("userId")
            }
        }, 'userName');

        const artistInfo = await Promise.all(artistsWithArtwork.map(async (artist) => {
            const artistId = artist._id;
            const artWorkCount = await ArtWork.countDocuments({ userId: artistId })

            return {
                artist: artist.userName,
                artWorkCount: artWorkCount
            };
        }));

        return res.json({ data: artistInfo });

    } catch (error){
        console.error("Error fetching the name of all the artist", error);
        return res.json({ error: "Error fetcing the name of all the artist"});
    }
});

router.get("/get/artist",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const artist = await User.find({}, 'userName');

        const artistInfo = await Promise.all(artist.map( async (artist) => {
            const artistId = artist._id;
          
            const profile = await Profile.findOne({ userId: artistId });

            
            let profilePic = null;
            if (profile && profile.profilePic) {
                profilePic = profile.profilePic.replace("../../../public", "");
            }

            return {
                userName: artist.userName,
                profilePic: profilePic,
                artistId,
            }
        }))
        
        return res.json({ data: artistInfo })

    } catch (error){
        console.error("Error fetching artist details", error);
        return res.json({ error: "Error fetching the details of the artist"});
    }
});


router.get("/profile/:userName", 
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const userName = req.params.userName;

        const user = await User.findOne({ userName });

        const userId = user._id;
        
        const profile = await Profile.findOne({ userId });

        const profilePic = profile.profilePic ? profile.profilePic.replace("../../../public", "") : null;
        const location = profile.location || null;
        const description = profile.description || null;

        const artworks = await ArtWork.find({userId});

        if(artworks === 0) {
            return res.json({ message: "No artworks found"})
        };

        const simplifiedArtwork = artworks.map(artwork => {
            const firstPhoto = artwork.artPhoto[0] || null;

            return {
                _id: artwork._id,
                title: artwork.title,
                price: artwork.price.toLocaleString(),
                artPhoto: firstPhoto.replace("../../../public", ""),
                size: artwork.size,
                medium: artwork.medium,
                surface: artwork.surface,
                artType: artwork.artType,
                creationYear: artwork.creationYear,
                quality: artwork.quality,
                delivery: artwork.delivery,
                description: artwork.description,
                
            }
        });

        return res.json({ data: {
            userName,
            userId,
            profilePic,
            location,
            description,
            artworkCount: artworks.length,
            artworks: simplifiedArtwork
        } });

    } catch (error) {
        console.error("Error fetching user proifile", error);
        return res.json({ error: "Error fetching details of an artist" });
    }
});

module.exports = router