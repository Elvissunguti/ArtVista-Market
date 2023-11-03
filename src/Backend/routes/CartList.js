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
})

router.get("/checkcartlist",
passport.authenticate("jwt", {session: false}),
async(req, res) => {
    try{

        const userId = req.user._id;

        const user = await User.findById(userId);

        if(!user){
            return res.json({ message: "User not found"});
        };

        const cartListedArt = user.cartList.map(art => art.toString());

        return res.json({ data: {cartListedArt}});

    } catch (error) {
        console.error("Error checking cartlist", error);
        return res.json({ error: "Error checking cartlist"});
    };
});


router.get("/checkcartlistnumber",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user){
            return res.json({ message: "Could not find user" });
        }; 
        const cartListNumber = user.cartListNumber;

        return res.json({ data: cartListNumber });

    } catch (error) {
        console.error("Error checking cartList length", error);
        return res.json({ error: "Error checking cartlist number" });
    }
});

router.get("/cartlisted",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user){
            return res.json({ message: "User not found" });
        }

        const cartListIds = user.cartList;

        if(cartListIds === 0){
            return res.json({ message: "There is no artwork in the cartList"})
        };

        const artWorks = await ArtWork.find({ _id: { $in: cartListIds }});

        const simplifiedArtwork = artWorks.map(artwork => {
            
            const firstPhoto = artwork.artPhoto[0] || null;
      
            return {
                _id: artwork._id,
                title: artwork.title,
                price: artwork.price,
                artPhoto: firstPhoto.replace("../../../public", ""),
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
      
        const totalPrice = simplifiedArtwork.reduce((total, artwork) => total + artwork.price, 0);

        res.json({ data: simplifiedArtwork, totalPrice }); 

    } catch(error){
        console.error("Error fetching all the artwork in the cartlist", error);
        return res.json({ error: "Error fetching all the artwork in the cartlist"});
    }
});

module.exports = router;