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

    getCartItems: async (req, res) => {
        const userId = req.user.id;

        try {
            const cart = await Cart.findOne({ userId }).populate('cartItems.foodId');

            if (!cart) {
                return res.status(404).json({ status: false, message: 'Cart not found' });
            }

            res.status(200).json({ status: true, cartItems: cart.cartItems });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
};