const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Model/User");
const ArtWork = require("../Model/ArtWork");


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
          user.wishListNumber = user.wishList.length; 

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
          user.wishListNumber = user.wishList.length;
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


// Route to check wishlist excluding sold items
router.get("/checkwishlist",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate({
        path: "wishList",
        match: { isSold: false }  // Only include artworks that are not sold
      });

      if (!user) {
        return res.json({ message: "User not found" });
      }

      const wishListedArt = user.wishList.map(art => art.toString());
      return res.json({ data: { wishListedArt } });

    } catch (error) {
      console.error("Error checking if the artwork is wishlisted", error);
      return res.json({ Error: "Error checking if the artwork is wishlisted" });
    }
  }
);

// Route to get wishlist item count excluding sold items
router.get("/checkwishlistnumber",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate({
        path: "wishList",
        match: { isSold: false }  // Only include unsold artworks
      });

      if (!user) {
        return res.json({ message: "User not found" });
      }

      const wishlistNumber = user.wishList.length;
      return res.json({ data: wishlistNumber });

    } catch (error) {
      console.error("Error checking the number of wishlisted art", error);
      return res.json({ Error: "Error checking the number of wishlisted artwork" });
    }
  }
);

// Route to retrieve wishlist details excluding sold items
router.get("/wishlisted",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.json({ Error: "User not found" });
      }

      const wishListIds = user.wishList;

      if (wishListIds.length === 0) {
        return res.json({ Message: "User's wishlist is empty" });
      }

      // Find artworks in the user's wishlist that are not sold
      const artWorks = await ArtWork.find({ 
        _id: { $in: wishListIds },
        isSold: false  // Exclude sold artworks
      });

      const simplifiedArtwork = artWorks.map(artwork => {
        const firstPhoto = artwork.artPhoto[0] || null;
        return {
          _id: artwork._id,
          title: artwork.title,
          price: artwork.price.toLocaleString(),
          artPhoto: firstPhoto ? firstPhoto : null,
          size: artwork.size,
          medium: artwork.medium,
          surface: artwork.surface,
          artType: artwork.artType,
          creationYear: artwork.creationYear,
          quality: artwork.quality,
          delivery: artwork.delivery,
          description: artwork.description,
        };
      });

      res.json({ data: simplifiedArtwork });

    } catch (error) {
      console.error("Error fetching all the artwork in the wishlist", error);
      return res.json({ Error: "Error fetching the wishlist artwork" });
    }
  }
);



module.exports = router;