const User = require('../models/User')
const imageFile = require('../utils/imageFile')

module.exports = {
    getUser: async (req, res) => {
        const userId = req.user.id

        try {
            const user = await User.findById({ _id: userId }, { password: 0, _v: 0, createdAt: 0, updatedAt: 0 })
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving user', error: error.message })
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
        const userId = req.user.id

        try {
            await User.findByIdAndDelete(userId)
            res.status(200).json({ status: true, message: "User Deleted Successfully!" })
        } catch (error) {
            res.status(500).json({ message: 'Error Deleting User' })
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
                        phone: req.body.phone
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
    }
}