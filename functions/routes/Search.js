const express = require("express");
const passport = require("passport");
const User = require("../Model/User");
const Profile = require("../Model/Profile");
const router = express.Router();
const ArtWork = require("../Model/ArtWork");

router.get("/artistsearch",
passport.authenticate("jwt", { session: false }),
async (req, res) => {
  try {
    const searchText = req.query.searchText;

    const users = await User.find({ userName: { $regex: searchText, $options: "i" } });

    if (!users || users.length === 0) {
      return res.json({ Message: "No artist found" });
    }

    const artistInfoList = [];

    // Iterate through all matching users
    for (const user of users) {
      // Fetch the profile based on user Id
      const profile = await Profile.findOne({ userId: user._id });

      // Handle the case where the profile does not exist
      const profilePic = profile ? profile.profilePic : null;

      const artistInfo = {
        artistId: user._id,
        userName: user.userName,
        profilePic: profilePic,
      };

      artistInfoList.push(artistInfo);
    }

    return res.json({ data: artistInfoList });
  } catch (error) {
    console.error("Error searching for artist", error);
    return res.json({ error: "Error searching for artist" });
  }
});


router.get("/artwork",
passport.authenticate("jwt", { session: false}),
async (req, res) => {
  try{
    const searchText = req.query.searchText;

    const artWorks =  await ArtWork.find({
      $or: [
        {title: {$regex: searchText, $options: "i"} },
        {description: {$regex: searchText, $options: "i"} },
        {medium: {$regex: searchText, $options: "i"} },
        {surface: {$regex: searchText, $options: "i"} },
      ],
    });

    if(artWorks.length === 0) {
      return res.json({ message: "search Result is empty"})
    };

    const simplifiedArtwork = artWorks.map(artwork => {
            
      const firstPhoto = artwork.artPhoto[0] || null;

      return {
          _id: artwork._id,
          title: artwork.title,
          price: artwork.price.toLocaleString(),
          artPhoto: firstPhoto,
          size: artwork.size,
          medium: artwork.medium,
          surface: artwork.surface,
          artType: artwork.artType,
          creationYear: artwork.creationYear,
          quality: artwork.quality,
          delivery: artwork.delivery,
          description: artwork.description,
      };
  })

    res.json({ data: simplifiedArtwork });
    
  } catch (error){
    console.log("Error getting search results", error);
    return res.json({ error: "error searching for artwork" });
  }
});

module.exports = router;
