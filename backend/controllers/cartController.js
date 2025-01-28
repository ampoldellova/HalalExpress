const Cart = require('../models/Cart')

module.exports = {
    addProductToCart: async (req, res) => {
        const userId = req.user.id;
        const { productId, totalPrice, quantity } = req.body;
        let count;

        try {
            const existingProduct = await Cart.findOne({ userId, productId })
            count = await Cart.countDocuments({ userId })

            if (existingProduct) {
                existingProduct.quantity += 1,
                    existingProduct.totalPrice += totalPrice,
                    await existingProduct.save()
            } else {
                const newCart = new Cart({
                    userId: userId,
                    productId: req.body.productId,
                    additives: req.body.additives,
                    instructions: req.body.instructions,
                    totalPrice: req.body.totalPrice,
                    quantity: req.body.quantity
                })

                await newCart.save()
                count = await Cart.countDocuments({ userId })
            }

            res.status(200).json({ status: true, count: count })
        } catch (error) {
            res.status(500).json({ status: false, message: error.message })
        }

    },
    removeProductFromCart: async (req, res) => {
        const itemId = req.params.id
        const userId = req.user.id
        let count;

        try {
            const cartItem = await Cart.findById(itemId)
            if (!cartItem) {
                return res.status(404).json({ status: false, message: "Cart Item not found" })
            }

            await Cart.findByIdAndDelete({ _id: itemId })
            count = await Cart.countDocuments({ userId })

            res.status(200).json({ status: true, cartCount: count })
        } catch (error) {
            res.status(500).json({ status: false, message: error.message })
        }
    },

    fetchUserCart: async (req, res) => {
        const userId = req.user.id;

        try {
            const userCart = await Cart.find({ userId: userId })
                .populate({
                    path: "productId",
                    select: "title imageUrl restaurant rating ratingCount"
                })

            res.status(200).json({ status: true, cart: userCart })
        } catch (error) {
            res.status(500).json({ status: false, message: error.message })
        }
    },

    clearUserCart: async (req, res) => {
        const userId = req.user.id;
        let count;

        try {
            await Cart.deleteMany({ userId: userId })
            count = await Cart.countDocuments({ userId })

            res.status(200).json({ status: true, count: count, message: "Cart cleared successfully" })
        } catch (error) {
            res.status(500).json({ status: false, message: error.message })
        }
    },

    getCartCount: async (req, res) => {

    },
    decrementProductQuantity: async (req, res) => {

    },
};