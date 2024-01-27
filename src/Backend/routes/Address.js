const express = require("express");
const passport = require("passport");
const Address = require("../Model/Address");
const router = express.Router();


// router to create address of a user
router.post("/create",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const userId = req.user._id;

        const {
            firstName,
            lastName,
            phoneNumber,
            address,
            region,
            city,
            moreInfo,
          } = req.body;
    
          
          const newAddress = new Address({
            firstName,
            lastName,
            phoneNumber,
            address,
            region,
            city,
            moreInfo,
            userId, // Reference to the user
          });
    
          
          const savedAddress = await newAddress.save();
    
          // Respond with the saved address
          return res.json(savedAddress);



    } catch (error){
        console.error("Error creating address for user", error);
        return res.json({ error: "Error creating address for user"});
    }
});

module.exports = router;