const express = require("express");
const passport = require("passport");
const User = require("../Model/User");
const Profile = require("../Model/Profile");
const router = express.Router();

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
      const profilePic = profile ? profile.profilePic.replace("../../../public", "") : null;

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

module.exports = router;
