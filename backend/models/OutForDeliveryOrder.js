const mongoose = require("mongoose");
const populate = require("mongoose-autopopulate");

const outForDeliveryOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      autopopulate: true,
    },
    currentLocation: {
      coordinates: {
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
      },
    },
    riderName: {
      type: String,
      required: true,
    },
    riderPhone: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
    },
    plateNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

outForDeliveryOrderSchema.plugin(populate);
module.exports = mongoose.model(
  "OutForDeliveryOrder",
  outForDeliveryOrderSchema
);
