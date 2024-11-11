const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Model/User");
const ArtWork = require("../Model/ArtWork");



router.post("/addcartlist/:artWorkId",
passport.authenticate("jwt", {session: false}),
async(req, res) => {
    try{

        const userId = req.user._id;

        const artWorkId = req.params.artWorkId;

        const user = await User.findById(userId);
        
        user.cartList.push(artWorkId);
        user.cartListNumber = user.cartList.length;

        await user.save();

        return res.json({ message: "Artwork added to cartList"})

    } catch (error){
        console.error("Error adding artwork to cartList", error);
        return res.json({ error: "Error adding artwork to cartList" });
    };
});


router.post("/deletecartlist/:artWorkId",
passport.authenticate("jwt", { session: false}),
async (req, res) => {
    try{

        const userId = req.user._id;

        const artWorkId = req.params.artWorkId;

        const user = await User.findById(userId);

        const index = user.cartList.indexOf(artWorkId);
        if (index !== -1){
            user.cartList.splice(index, 1);
            user.cartListNumber = user.cartList.length;
            await user.save();

            return res.json({ message: "Artwork removed from cartlist" });
        } else {
            return res.json({ error: "Artwork not found in CartList" })
        }

    } catch (error) {
        console.error("Error deleting artwork from cartList", error);
        return res.json({ error: "Error deleting artwork from cartList" });
    }
});

router.get("/checkcartlist",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate({
        path: "cartList",
        match: { isSold: false }  // Only include unsold artworks
      });

      if (!user) {
        return res.json({ message: "User not found" });
      }

      const cartListedArt = user.cartList.map(art => art.toString());
      return res.json({ data: { cartListedArt } });

    } catch (error) {
      console.error("Error checking cartlist", error);
      return res.json({ error: "Error checking cartlist" });
    }
  }
);

router.get("/checkcartlistnumber",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate({
        path: "cartList",
        match: { isSold: false }  // Only include unsold artworks
      });

      if (!user) {
        return res.json({ message: "Could not find user" });
      }

      const cartListNumber = user.cartList.length;
      return res.json({ data: cartListNumber });

    } catch (error) {
      console.error("Error checking cartList length", error);
      return res.json({ error: "Error checking cartlist number" });
    }
  }
);

router.get("/cartlisted",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.json({ message: "User not found" });
      }

      const cartListIds = user.cartList;

      if (cartListIds.length === 0) {
        return res.json({ message: "There is no artwork in the cartList" });
      }

      // Find artworks in the user's cartList that are not sold
      const artWorks = await ArtWork.find({ 
        _id: { $in: cartListIds },
        isSold: false  // Exclude sold artworks
      });

      // Fetch user names for userIds associated with artworks
      const userIds = artWorks.map((artwork) => artwork.userId);
      const users = await User.find({ _id: { $in: userIds } });

      const simplifiedArtwork = artWorks.map((artwork) => {
        const firstPhoto = artwork.artPhoto[0] || null;

        // Find the user corresponding to the artwork's userId
        const user = users.find((u) => u._id.toString() === artwork.userId.toString());

        return {
          _id: artwork._id,
          title: artwork.title,
          price: artwork.price.toLocaleString(),
          artPhoto: firstPhoto ? firstPhoto: null,
          size: artwork.size,
          medium: artwork.medium,
          surface: artwork.surface,
          artType: artwork.artType,
          creationYear: artwork.creationYear,
          quality: artwork.quality,
          delivery: artwork.delivery,
          description: artwork.description,
          userName: user ? user.userName : "Unknown",
        };
      });

      const totalPrice = simplifiedArtwork.reduce((total, artwork) => total + parseInt(artwork.price.replace(/,/g, "")), 0).toLocaleString();

      res.json({ data: simplifiedArtwork, totalPrice });

    } catch (error) {
      console.error("Error fetching all the artwork in the cartlist", error);
      return res.json({ error: "Error fetching all the artwork in the cartlist" });
    }
  }
);




module.exports = router;