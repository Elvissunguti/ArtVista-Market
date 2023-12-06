const express = require("express");
const router = express.Router();
const Message = require("../Model/Message");
const passport = require("passport");


router.post("/create",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{
        const { content } = req.body;
        const userId = req.user._id;

        const newMessage = new Message({ content, userId});

        await newMessage.save();

        res.json({ newMessage});


    } catch (error) {
        console.error("Error creating a new message", error);
        return res.json({ error: "Error creating a new message" });
    }
});

module.exports = router;