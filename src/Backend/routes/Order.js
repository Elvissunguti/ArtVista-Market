const express = require("express");
const passport = require("passport");
const ArtWork = require("../Model/ArtWork");
const Order = require("../Model/Order");
const router = express.Router();

// Router to make order
router.post("/make/:artworkIds",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const artworkIds = req.params.artworkIds.split(',');

      // Retrieve artworks based on the provided artworkIds
      const artworks = await ArtWork.find({ _id: { $in: artworkIds } });

      // Create an object to store orders based on artistId
      const ordersByArtist = {};

      // Iterate over the artworks and organize orders by artist
      artworks.forEach((artwork) => {
        const artistId = artwork.userId;

        if (!ordersByArtist[artistId]) {
          ordersByArtist[artistId] = {
            userId,
            artworks: [],
            totalPrice: 0,
          };
        }

        // Calculate quantity 
        const quantity = Array.isArray(req.user.orders)
          ? req.user.orders.reduce((total, order) => {
              const matchingArtwork = order.artworks.find(
                (aw) =>
                  aw.artistId.toString() === artistId.toString() &&
                  aw.artworkId.toString() === artwork._id.toString()
              );
              return total + (matchingArtwork ? matchingArtwork.quantity : 0);
            }, 0) + 1
          : 1;

        // Include total price of all artworks combined within the artworks array
        const totalPrice = ordersByArtist[artistId].totalPrice + artwork.price;
        ordersByArtist[artistId].artworks.push({
          artistId,
          artworkId: artwork._id,
          quantity,
          totalPrice,
        });

        // Update the total price for the artist's order
        ordersByArtist[artistId].totalPrice += artwork.price;
      });

      // Save orders for each artist separately
      const savedOrders = await Promise.all(
        Object.values(ordersByArtist).map(async (orderDetails) => {
          const order = new Order(orderDetails);
          return await order.save();
        })
      );

      return res.json({ success: true, orders: savedOrders });
    } catch (error) {
      console.error("Error making artwork order", error);
      return res.json({ error: "Error making artwork order" });
    }
  }
);




// router to fetch all my orders
router.get("/myorders",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const userId = req.user._id;



    } catch(error){
        console.error("Error fetching artworks ordered", error);
        return res.json({ error: "Error fetching ordered artworks" });
    }
});

module.exports = router;