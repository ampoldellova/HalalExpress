const mongoose = require("mongoose");
const populate = require("mongoose-autopopulate");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
    },
    cartItems: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          autopopulate: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ingredients",
          autopopulate: true,
        },
        additives: {
          type: [],
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
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

cartSchema.plugin(populate);
module.exports = mongoose.model("Cart", cartSchema);
