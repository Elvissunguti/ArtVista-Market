const express = require("express");
const passport = require("passport");
const ArtWork = require("../Model/ArtWork");
const Order = require("../Model/Order");
const paypal = require('paypal-rest-sdk');
const User = require("../Model/User");
const router = express.Router();

// PayPal configuration
paypal.configure({
  mode: 'live', 
  client_id: 'AU0xQdzRv2-FlVhWmF0dTgfTAvpJUvwoJ1aMMc9oRe1yXQVCvOO61mRZ7Zyv5JBxxQFxFfxOQr2lixqm',
  client_secret: 'EKt-f_70Et2tQYr3x3hITA7WmZ_EvLhW3NRC3nYQ-CRGun86l04eScW1P8YmDHVmVouMlSZjcQRKhdkc',
});



router.post("/make/:artworkIds",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const artworkIds = req.params.artworkIds.split(',');
      const paymentMethod = req.body.paymentMethod; // Payment method selected by the user
      const paymentAmount = req.body.paymentAmount;

      // Validate payment method
      if (paymentMethod !== 'cash' && paymentMethod !== 'paypal') {
        return res.status(400).json({ error: 'Invalid payment method' });
      }

      // Retrieve artworks based on the provided artworkIds
      const artworks = await ArtWork.find({ _id: { $in: artworkIds } });

      // Calculate total price
      const totalPrice = artworks.reduce((acc, artwork) => acc + artwork.price, 0);

      // Handle payment based on the selected payment method
      if (paymentMethod === 'cash') {
        // Handle cash payment logic here
        // For example, you can save the order directly without processing any payment
        const order = new Order({
          userId,
          artworks,
          totalPrice,
          paymentMethod: 'cash',
          status: 'pending', // Set status to pending
          // Add other order details as needed
        });
        await order.save();

        // Mark artworks as sold
        await ArtWork.updateMany({ _id: { $in: artworkIds } }, { $set: { isSold: true } });

        // Remove artworks from user's cart list
        const user = await User.findById(userId);
        for (const artworkId of artworkIds) {
          const index = user.cartList.indexOf(artworkId);
          if (index !== -1) {
            user.cartList.splice(index, 1);
          }
        }
        user.cartListNumber = user.cartList.length;
        await user.save();

        return res.json({ success: true, message: 'Order placed successfully with cash payment' });
      } else if (paymentMethod === 'paypal') {
        // Create PayPal payment
        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: 'http://localhost:3000/success',
                cancel_url: 'http://localhost:3000/cancel'
            },
            transactions: [{
                amount: {
                    total: paymentAmount,
                    currency: 'USD'
                },
                description: 'Payment for artwork order'
            }]
        };
    
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.send(payment.links[i].href);
                        break;
                    }
                }
            }
        });
    
        // After PayPal payment approval, the order is captured and saved
        const capture_payment_json = {
            intent: 'sale',
            payer_id: req.query.PayerID
        };
    
        paypal.payment.execute(req.query.paymentId, capture_payment_json, async function (error, payment) {
            if (error) {
                console.error("Error capturing PayPal payment:", error);
                return res.status(500).json({ error: "Error capturing PayPal payment" });
            } else {
                console.log("Payment captured:", payment);
                // Create order with payment information
                const order = new Order({
                    userId,
                    artworks,
                    totalPrice,
                    paymentMethod: 'paypal',
                    paypalPaymentId: payment.id,
                    status: 'pending', // Set status to pending
                    // Add other order details as needed
                });
    
                await order.save();
    
                // Mark artworks as sold
                await ArtWork.updateMany({ _id: { $in: artworkIds } }, { $set: { isSold: true } });
    
                // Remove artworks from user's cart list
                const user = await User.findById(userId);
                for (const artworkId of artworkIds) {
                    const index = user.cartList.indexOf(artworkId);
                    if (index !== -1) {
                        user.cartList.splice(index, 1);
                    }
                }
                user.cartListNumber = user.cartList.length;
                await user.save();
    
                return res.json({ success: true, message: 'Order placed successfully with PayPal payment' });
            }
        });
    }
    
    } catch (error) {
      console.error("Error making artwork order", error);
      return res.status(500).json({ error: "Error making artwork order" });
    }
  }
);




// router to fetch all my orders
router.get("/myorders",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const userId = req.user._id;

        const orders = await Order.find({ userId, status: { $ne: "completed" } });

              // Fetch artwork details for each order
      const artworkOrders = await Promise.all(orders.map(async (order) => {
        const artworks = await Promise.all(order.artworks.map(async (artwork) => {
          const artworkDetails = await ArtWork.findById(artwork.artworkId, 'title price artPhoto');
          if (!artworkDetails) {
            // Handle the case where artwork is not found
            return null;
          }
          const { title, price, artPhoto } = artworkDetails;
          return { title, price, artPhoto };
        }));
        return { ...order.toObject(), artworks: artworks.filter(Boolean) }; // Filter out null artworks
      }));

        return res.json({ data: artworkOrders});

    } catch(error){
        console.error("Error fetching artworks ordered:", error);
        return res.json({ error: "Error fetching ordered artworks" });
    }
});


// router to fetch orders received
router.get("/receivedorder",
passport.authenticate("jwt", {session: false}),
async(req, res) => {
    try{
        const artistId = req.user._id;

        const receivedOrders = await Order.find({ "artworks.artistId": artistId });

        return res.json({ data: receivedOrders });

    } catch(error){
        console.error("error fetching received artwork order", error);
        return res.json({ error: "Error fetching received artwork order" });
    }
});


module.exports = router;