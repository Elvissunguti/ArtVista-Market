const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Model/User");


router.post("/addwishlist/:artWorkId",
passport.authenticate("jwt", { session: false}),
async (req, res) => {
    try {
        const userId = req.user._id;

        const artWorkId = req.params.artWorkId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          user.wishList.push(artWorkId);

          await user.save();

          return res.json({ message: "Artwork added to wishlist" });

    } catch (error) {
        console.error("Error Adding artWork to wishList", error);
        return res.json({ Error : "Error adding artwork to wishlist"});
    }
});


module.exports = router;