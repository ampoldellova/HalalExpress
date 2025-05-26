const PendingUser = require("../models/PendingUser");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { email } = require("../utils/email");

module.exports = {
  createUser: async (req, res) => {
    try {
      const user = req.body;

      // Check if email already exists in User or PendingUser
      const existingUser = await User.findOne({ email: user.email });
      const existingPending = await PendingUser.findOne({ email: user.email });
      if (existingUser || existingPending) {
        return res.status(400).json({
          status: false,
          error: "Email already in use or pending verification.",
        });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Encrypt password
      const encryptedPassword = CryptoJS.AES.encrypt(
        user.password,
        process.env.SECRET
      ).toString();

      // Save to PendingUser
      const pendingUser = new PendingUser({
        username: user.username,
        email: user.email,
        password: encryptedPassword,
        phone: user.phone,
        otp,
        otpExpires,
      });
      await pendingUser.save();

      // Send OTP email
      await email({
        to: user.email,
        subject: "HalalExpress Verification Code",
        text: `Your OTP code is: ${otp}`,
        html: `<p>Your OTP code is: <b>${otp}</b></p>`,
      });

      res.status(200).json({
        status: true,
        message: "OTP sent to email. Please verify to complete registration.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error: error.message });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const pendingUser = await PendingUser.findOne({ email });

      if (!pendingUser) {
        return res
          .status(400)
          .json({ status: false, error: "No pending registration found." });
      }

      if (pendingUser.otp !== otp || pendingUser.otpExpires < new Date()) {
        await PendingUser.deleteOne({ email });
        return res
          .status(400)
          .json({ status: false, error: "Invalid or expired OTP." });
      }

      // Create user in User collection
      const newUser = new User({
        username: pendingUser.username,
        email: pendingUser.email,
        password: pendingUser.password,
        phone: pendingUser.phone,
        userType: "Client",
      });

      await newUser.save();

      // Remove from PendingUser
      await PendingUser.deleteOne({ email });

      res
        .status(201)
        .json({ status: true, message: "Email verified and account created." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error: error.message });
    }
  },

  // createUser: async (req, res) => {
  //   try {
  //     const user = req.body;

  //     const newUser = new User({
  //       username: user.username,
  //       email: user.email,
  //       password: CryptoJS.AES.encrypt(
  //         user.password,
  //         process.env.SECRET
  //       ).toString(),
  //       phone: user.phone,
  //       userType: "Client",
  //     });

  //     await newUser.save();

  //     res.status(201).json({ status: true });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ status: false, error: error.message });
  //   }
  // },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne(
        { email: req.body.email },
        { __v: 0, updatedAt: 0, createdAt: 0 }
      );

      if (!user) {
        return res.status(401).json({ message: "Wrong Credentials" });
      }

      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      );
      const decrypted = decryptedPassword.toString(CryptoJS.enc.Utf8);

      if (decrypted !== req.body.password) {
        return res.status(401).json({ message: "Wrong Password" });
      }

      const userToken = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
          email: user.email,
        },
        process.env.JWT_SEC,
        { expiresIn: "21d" }
      );

      const { password, ...others } = user._doc;
      return res.status(200).json({ ...others, userToken });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, error: error.message });
    }
  },
};
