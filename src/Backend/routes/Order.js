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

// Function to create order/payment
const createOrder = async (paymentAmount) => {
    try {

      
        // Create payment payload for PayPal
        const paymentPayload = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            transactions: [{
                amount: {
                    currency: 'USD',
                    total: totalPrice.toFixed(2), // Use the amount from the data parameter
                },
                description: 'Payment for artwork order', // Add description if needed
            }],
            redirect_urls: {
                return_url: 'http://localhost:3000/success', // Replace with your success URL
                cancel_url: 'http://localhost:3000/cancel',  // Replace with your cancel URL
            },
        };

        // Create PayPal payment
        const payment = await new Promise((resolve, reject) => {
            paypal.payment.create(paymentPayload, (error, payment) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(payment);
                }
            });
        });

        // Return the payment ID
        return payment.id;
    } catch (error) {
        console.error('Error creating PayPal payment:', error);
        throw error;
    }
};

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
        const paypalPaymentId = await createOrder(totalPrice);

        // Create order with payment information
        const order = new Order({
          userId,
          artworks,
          totalPrice,
          paymentMethod: 'paypal',
          paypalPaymentId,
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

        const artworkOrder = await Order.find({ userId });

        return res.json({ data: artworkOrder})

    } catch(error){
        console.error("Error fetching artworks ordered", error);
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