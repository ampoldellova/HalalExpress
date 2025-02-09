const Cart = require('../models/Cart')

module.exports = {
    addFoodToCart: async (req, res) => {
        const userId = req.user.id;
        const { foodId, totalPrice, quantity, additives, instructions } = req.body;

        try {
            let cart = await Cart.findOne({ userId });

            if (cart) {
                const existingItemIndex = cart.cartItems.findIndex(item => item.foodId.toString() === foodId);

                if (existingItemIndex > -1) {
                    cart.cartItems[existingItemIndex].quantity += quantity;
                    cart.cartItems[existingItemIndex].totalPrice += totalPrice;
                } else {
                    cart.cartItems.push({
                        foodId,
                        additives,
                        instructions,
                        quantity,
                        totalPrice
                    });
                }

                cart.totalAmount += totalPrice;
                await cart.save();
            } else {
                const newCart = new Cart({
                    userId,
                    cartItems: [{
                        foodId,
                        additives,
                        instructions,
                        quantity,
                        totalPrice
                    }],
                    totalAmount: totalPrice
                });

                await newCart.save();
            }

            const count = await Cart.countDocuments({ userId });
            res.status(200).json({ status: true, count });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
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