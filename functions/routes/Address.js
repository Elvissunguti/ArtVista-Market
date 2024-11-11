const express = require("express");
const passport = require("passport");
const Address = require("../Model/Address");
const router = express.Router();


// router to create or update address of a user
router.post("/createOrUpdate",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;

      // Check if the user already has an existing address
      const existingAddress = await Address.findOne({ userId });

      if (existingAddress) {
        // If an address exists, update it
        existingAddress.firstName = req.body.firstName || existingAddress.firstName;
        existingAddress.lastName = req.body.lastName || existingAddress.lastName;
        existingAddress.phoneNumber = req.body.phoneNumber || existingAddress.phoneNumber;
        existingAddress.address = req.body.address || existingAddress.address;
        existingAddress.region = req.body.region || existingAddress.region;
        existingAddress.city = req.body.city || existingAddress.city;
        existingAddress.moreInfo = req.body.moreInfo || existingAddress.moreInfo;

        const updatedAddress = await existingAddress.save();

        // Respond with the updated address
        return res.json(updatedAddress);
      }

      // If no address exists, create a new one
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
        userId, 
      });

      const savedAddress = await newAddress.save();

      // Respond with the saved address
      return res.json(savedAddress);

    } catch (error) {
      console.error("Error creating/updating address for user", error);
      return res.status(500).json({ error: "Error creating/updating address for user" });
    }
  });



// router to fetch address of the user
router.get("/fetch",
passport.authenticate("jwt", {session: false}),
async(req, res) => {
    try{

        const userId = req.user._id;
        const email = req.user.email;

        const address = await Address.findOne({ userId: userId});
        
        const simplifiedAddress = {
          id: address._id,
          firstName: address.firstName,
          lastName: address.lastName,
          phoneNumber: address.phoneNumber,
          address: address.address,
          region: address.region,
          city: address.city,
          moreInfo: address.moreInfo,
          email,
        };

        return res.json({ data: simplifiedAddress});
         
    } catch(error){
        console.error("Error fetching address of the user", error);
        return res.json({ error: "Error fetching address of the user" });
    }
});


module.exports = router;