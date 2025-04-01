const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: [
      {
        latitude: {
          type: Number,
          default: "",
        },
        longitude: {
          type: Number,
          default: "",
        },
        address: {
          type: String,
          default: "",
        },
      },
    ],
    phone: {
      type: String,
      required: false,
    },
    userType: {
      type: String,
      required: true,
      default: "Client",
      enum: ["Admin", "Supplier", "Vendor", "Client"],
    },
    profile: {
      public_id: {
        type: String,
        default: "HalalExpress/Profile/profile_nsvdbb",
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dwkmutbz3/image/upload/v1736011952/HalalExpress/Profile/profile_nsvdbb.png",
      },
    },
    notificationToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
