const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../Model/User");



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

module.exports = router;