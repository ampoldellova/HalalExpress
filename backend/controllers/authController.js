const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res) => {
    try {
      const user = req.body;

      const newUser = new User({
        username: user.username,
        email: user.email,
        password: CryptoJS.AES.encrypt(
          user.password,
          process.env.SECRET
        ).toString(),
        phone: user.phone,
        userType: "Client",
      });

      await newUser.save();

      res.status(201).json({ status: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error: error.message });
    }
  },

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
