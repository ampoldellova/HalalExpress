const mongoose = require("mongoose");

const PendingUserSchema = new mongoose.Schema(
  {
    username: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    otp: String,
    otpExpires: Date,
  },
  { timestamps: false }
);

module.exports = mongoose.model("PendingUser", PendingUserSchema);
