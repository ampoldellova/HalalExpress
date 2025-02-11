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
    },

    incrementFoodItemQuantity: async (req, res) => {
        const userId = req.user.id;
        const { foodId, quantity, totalPrice } = req.body;

        try {
            let cart = await Cart.findOne({ userId });

            if (!cart) {
                return res.status(404).json({ status: false, message: 'Cart not found' });
            }

            const existingItemIndex = cart.cartItems.findIndex(item => item.foodId.toString() === foodId);

            if (existingItemIndex > -1) {
                const oldQuantity = cart.cartItems[existingItemIndex].quantity;
                const oldTotalPrice = cart.cartItems[existingItemIndex].totalPrice;

                cart.cartItems[existingItemIndex].quantity = quantity;
                cart.cartItems[existingItemIndex].totalPrice = totalPrice;

                cart.totalAmount += (totalPrice - oldTotalPrice);
                await cart.save();

                return res.status(200).json({ status: true, message: 'Quantity and total price updated successfully' });
            } else {
                return res.status(404).json({ status: false, message: 'Food item not found in cart' });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    decrementFoodItemQuantity: async (req, res) => {
        const userId = req.user.id;
        const { foodId, quantity } = req.body;

        try {
            let cart = await Cart.findOne({ userId });

            if (!cart) {
                return res.status(404).json({ status: false, message: 'Cart not found' });
            }

            const existingItemIndex = cart.cartItems.findIndex(item => item.foodId.toString() === foodId);

            if (existingItemIndex > -1) {
                const oldQuantity = cart.cartItems[existingItemIndex].quantity;
                const oldTotalPrice = cart.cartItems[existingItemIndex].totalPrice;

                if (oldQuantity - quantity < 1) {
                    cart.totalAmount -= oldTotalPrice;
                    cart.cartItems.splice(existingItemIndex, 1);
                } else {
                    cart.cartItems[existingItemIndex].quantity -= quantity;
                    cart.cartItems[existingItemIndex].totalPrice -= (oldTotalPrice / oldQuantity) * quantity;
                    cart.totalAmount -= (oldTotalPrice / oldQuantity) * quantity;
                }

                await cart.save();

                return res.status(200).json({ status: true, message: 'Quantity decremented successfully' });
            } else {
                return res.status(404).json({ status: false, message: 'Food item not found in cart' });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
};