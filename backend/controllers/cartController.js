const Cart = require("../models/Cart");

module.exports = {
  addFoodToCart: async (req, res) => {
    const userId = req.user.id;
    const {
      foodId,
      totalPrice,
      quantity,
      additives,
      instructions,
      restaurantId,
    } = req.body;

    try {
      let cart = await Cart.findOne({ userId });

      if (cart) {
        const differentRestaurantItemIndex = cart.cartItems.findIndex(
          (item) => item.foodId.restaurant.toString() !== restaurantId
        );
        if (differentRestaurantItemIndex > -1) {
          cart.cartItems = cart.cartItems.filter(
            (item) => item.foodId.restaurant.toString() === restaurantId
          );
          cart.totalAmount = 0;
        }

        const existingItemIndex = cart.cartItems.findIndex(
          (item) => item.foodId._id.toString() === foodId
        );

        if (existingItemIndex > -1) {
          cart.cartItems[existingItemIndex].quantity += quantity;
          cart.cartItems[existingItemIndex].totalPrice += totalPrice;
        } else {
          cart.cartItems.push({
            foodId,
            restaurantId,
            additives,
            instructions,
            quantity,
            totalPrice,
          });
        }

        cart.totalAmount += totalPrice;
        await cart.save();
      } else {
        const newCart = new Cart({
          userId,
          cartItems: [
            {
              foodId,
              restaurantId,
              additives,
              instructions,
              quantity,
              totalPrice,
            },
          ],
          totalAmount: totalPrice,
        });

        await newCart.save();
      }

      const count = await Cart.countDocuments({ userId });
      res.status(200).json({ status: true, count });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  removeFoodFromCart: async (req, res) => {
    try {
      const { userId, foodId } = req.query;

      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemToRemove = cart.cartItems.find(
        (item) => item.foodId._id.toString() === foodId
      );
      if (!itemToRemove) {
        return res.status(404).json({ message: "Food item not found in cart" });
      }

      cart.cartItems = cart.cartItems.filter(
        (item) => item.foodId._id.toString() !== foodId
      );
      cart.totalAmount -= itemToRemove.totalPrice;

      await cart.save();
      res.status(200).json({ message: "Food item removed from cart", cart });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  getCartItems: async (req, res) => {
    const userId = req.user.id;

    try {
      const cart = await Cart.findOne({ userId }).populate("cartItems.foodId");

      if (!cart) {
        return res
          .status(404)
          .json({ status: false, message: "Cart not found" });
      }

      res
        .status(200)
        .json({ status: true, cartItems: cart.cartItems, cart: cart });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  incrementCartItemQuantity: async (req, res) => {
    const userId = req.user.id;
    const foodId = req.params.id;
    try {
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        return res
          .status(404)
          .json({ status: false, message: "Cart not found" });
      }

      const existingItemIndex = cart.cartItems.findIndex(
        (item) => item.foodId._id.toString() === foodId
      );

      if (existingItemIndex > -1) {
        const item = cart.cartItems[existingItemIndex];
        item.quantity += 1;
        item.totalPrice += item.foodId.price;
        cart.totalAmount += item.foodId.price;

        await cart.save();
        return res
          .status(200)
          .json({ status: true, message: "Quantity incremented successfully" });
      } else {
        return res
          .status(404)
          .json({ status: false, message: "Item not found in cart" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  decrementCartItemQuantity: async (req, res) => {
    const userId = req.user.id;
    const foodId = req.params.id;

    try {
      let cart = await Cart.findOne({ userId });

      if (cart) {
        const existingItemIndex = cart.cartItems.findIndex(
          (item) => item.foodId._id.toString() === foodId
        );

        if (existingItemIndex > -1) {
          const item = cart.cartItems[existingItemIndex];
          if (item.quantity > 1) {
            item.quantity -= 1;
            item.totalPrice -= item.foodId.price;
            cart.totalAmount -= item.foodId.price;

            await cart.save();
            return res.status(200).json({
              status: true,
              message: "Quantity decremented successfully",
            });
          } else {
            return res.status(400).json({
              status: false,
              message: "Quantity cannot be less than 1",
            });
          }
        } else {
          return res
            .status(404)
            .json({ status: false, message: "Item not found in cart" });
        }
      } else {
        return res
          .status(404)
          .json({ status: false, message: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  clearCart: async (req, res) => {
    const userId = req.user.id;

    try {
      let cart = await Cart.findOne({ userId });

      if (cart) {
        cart.cartItems = [];
        cart.totalAmount = 0;

        await cart.save();
        return res
          .status(200)
          .json({ status: true, message: "Cart cleared successfully" });
      } else {
        return res
          .status(404)
          .json({ status: false, message: "Cart not found" });
      }
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
