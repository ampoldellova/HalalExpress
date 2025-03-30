const User = require("../models/User");
const imageFile = require("../utils/imageFile");

module.exports = {
  getUser: async (req, res) => {
    const userId = req.user.id;

    try {
      const user = await User.findById(
        { _id: userId },
        { password: 0, _v: 0, createdAt: 0, updatedAt: 0 }
      );
      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving user", error: error.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const userId = req.user.id;
      const users = await User.find({ _id: { $ne: userId } });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Error fetching users" });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.user.id;

    try {
      await User.findByIdAndDelete(userId);
      res
        .status(200)
        .json({ status: true, message: "User Deleted Successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error Deleting User" });
    }
  },

  updateUser: async (req, res) => {
    // console.log(req.file)
    try {
      if (req.file) {
        req.body.profile = await imageFile.uploadSingle({
          imageFile: req.file,
          request: req,
        });
        await User.findByIdAndUpdate(
          req.user.id,
          {
            username: req.body.username,
            email: req.body.email,
            profile: req.body.profile,
            phone: req.body.phone,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        res.status(201).json({ success: true, message: "User is Updated" });
      } else {
        await User.findByIdAndUpdate(req.user.id, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(201).json({ success: true, message: "User is Updated" });
      }
    } catch (err) {
      console.log(err);
    }
  },

  addAddress: async (req, res) => {
    const userId = req.user.id;
    const { latitude, longitude, address } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.address.push({ latitude, longitude, address });
      await user.save();

      res.status(200).json({
        success: true,
        message: "Address added successfully",
        address: user.address,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error adding address", error: error.message });
    }
  },

  deleteAddress: async (req, res) => {
    const userId = req.user.id;
    const { addressId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const addressIndex = user.address.findIndex(
        (addr) => addr.id === addressId
      );
      if (addressIndex === -1) {
        return res.status(404).json({ message: "Address not found" });
      }

      user.address.splice(addressIndex, 1);
      await user.save();

      res.status(200).json({
        success: true,
        message: "Address deleted successfully",
        address: user.address,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting address", error: error.message });
    }
  },

  getUserAddresses: async (req, res) => {
    const userId = req.user.id;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ success: true, addresses: user.address });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching addresses", error: error.message });
    }
  },

  editUserAddress: async (req, res) => {
    const userId = req.user.id;
    const { addressId, newAddress } = req.body;
    console.log(req.body);
    console.log(userId);

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const addressIndex = user.address.findIndex(
        (address) => address.id === addressId
      );
      if (addressIndex === -1) {
        return res.status(404).json({ message: "Address not found" });
      }

      user.address[addressIndex] = {
        ...user.address[addressIndex],
        ...newAddress,
      };
      await user.save();

      res.status(200).json({
        success: true,
        message: "Address updated successfully",
        address: user.address[addressIndex],
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating address", error: error.message });
    }
  },

  updateUserNotifToken: async (req, res) => {
    console.log(req.body.expoPushToken);
    try {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          notificationToken: req.body.expoPushToken,
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  },

  getPushToken: async (req, res) => {
    console.log(req.user);
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ expoPushToken: user.notificationToken });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  },
};
