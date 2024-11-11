const mongoose = require("mongoose");

const Order = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    artworks: [
        {
          artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          artworkId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artwork",
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
    totalPrice: {
        type: Number,
        default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "paypal"], 
    },
    paypalPaymentId: {
      type: String,
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "completed", "cancelled"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const OrderModel = mongoose.model("Order", Order);

module.exports = OrderModel;