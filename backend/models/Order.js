const mongoose = require("mongoose");
const populate = require("mongoose-autopopulate");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      autopopulate: true,
    },
    orderItems: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          autopopulate: true,
        },
        additives: {
          type: [],
          default: "",
        },
        instructions: {
          type: String,
          trim: true,
          maxlength: 250,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    deliveryOption: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    },
    subTotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    orderNote: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    rating: {
      stars: {
        type: Number,
        min: 1,
        max: 5,
      },
      feedback: {
        type: String,
        maxlength: 250,
      },
      status: {
        type: String,
        default: "pending",
      },
    },
  },
  { timestamps: true }
);

orderSchema.plugin(populate);
module.exports = mongoose.model("Order", orderSchema);
