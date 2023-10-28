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


router.post("/deletewishlist/:artWorkId",
passport.authenticate("jwt", {session: false}),
async(req, res) => {
    try{

        const userId = req.user._id;

        const artWorkId = req.params.artWorkId;

        const user = await User.findById(userId);

        if (!user){
            return res.json({ error: "User npt found"})
        };

        const index = user.wishList.indexOf(artWorkId);
        if (index !== -1) {
          // Remove the artwork ID from the wishlist
          user.wishList.splice(index, 1);
          await user.save();
  
          return res.json({ message: "Artwork removed from wishlist" });
        } else {
          return res.status(404).json({ error: "Artwork not found in wishlist" });
        }

    } catch (error){
        console.error("Error removing artwork from wishList", error);
        return res.json({ Error: "Error removing artwork from wishlist"});
    }
});


router.get("/checkwishlist",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const userId = req.user._id;

        const user = await User.findById(userId);

        if(!user){
            return res.json({ message: "User not found"});
        };

        const wishListedArt = user.wishList.map(art => art.toString());

        return res.json({ data: { wishListedArt }})

    } catch (error) {
        console.error("Error checking if the artWork is wishlisted", error);
        return res.json({ Error: "Error checking if the artwork is wishlisted"});
    }
});


router.get("/checkwishlistnumber",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.json({ message: "User not found" });
      }

      const wishListedArt = user.wishList;
      const numberOfWishlistedArt = wishListedArt.length;

      return res.json({ data: { numberOfWishlistedArt } });

    } catch (error) {
      console.error("Error checking the number of wishlisted art", error);
      return res.json({ Error: "Error checking the number of wishlisted art" });
    }
  }
);


module.exports = router;