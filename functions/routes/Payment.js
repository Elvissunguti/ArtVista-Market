const express = require("express");
const passport = require("passport");
const router = express.Router();
const paypal = require("paypal-rest-sdk");

// PayPal configuration
paypal.configure({
  mode: "live", // 'sandbox' or 'live'
  client_id: "AU0xQdzRv2-FlVhWmF0dTgfTAvpJUvwoJ1aMMc9oRe1yXQVCvOO61mRZ7Zyv5JBxxQFxFfxOQr2lixqm",
  client_secret: "EKt-f_70Et2tQYr3x3hITA7WmZ_EvLhW3NRC3nYQ-CRGun86l04eScW1P8YmDHVmVouMlSZjcQRKhdkc",
});

// Route for initiating a PayPal payment
router.post("/create-payment",
passport.authenticate("jwt", {session: false}),
 async (req, res) => {
  const { amount, currency, description } = req.body;

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    transactions: [
      {
        amount: {
          currency,
          total: amount,
        },
        description,
      },
    ],
    redirect_urls: {
      return_url: "http://localhost:3000/success", // Replace with your success URL
      cancel_url: "http://localhost:3000/cancel",  // Replace with your cancel URL
    },
  };

  try {
    const payment = await new Promise((resolve, reject) => {
      paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });

    res.json({ paymentID: payment.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for executing a PayPal payment
router.post("/execute-payment",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
  const { paymentID, payerID } = req.body;

  const execute_payment_json = {
    payer_id: payerID,
  };

  try {
    const payment = await new Promise((resolve, reject) => {
      paypal.payment.execute(paymentID, execute_payment_json, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });

    // Handle successful payment (e.g., update order status)
    console.log("Payment executed successfully:", payment);
    res.json({ success: true, payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
