const Cart = require("../models/Cart");

module.exports = {
  addItemToCart: async (req, res) => {
    const user = req.user;
    const {
      foodId,
      productId,
      totalPrice,
      quantity,
      additives,
      instructions,
      restaurantId,
      supplierId,
    } = req.body;

    try {
      if (user.userType === "Vendor") {
        let cart = await Cart.findOne({ userId: user.id });

        if (cart) {
          const differentRestaurantItemIndex = cart.cartItems.findIndex(
            (item) => item.productId.supplier.toString() !== supplierId
          );

          if (differentRestaurantItemIndex > -1) {
            cart.cartItems = cart.cartItems.filter(
              (item) => item.productId.supplier.toString() === supplierId
            );
            cart.totalAmount = 0;
          }

          const existingItemIndex = cart.cartItems.findIndex(
            (item) => item.productId._id.toString() === productId
          );

          if (existingItemIndex > -1) {
            cart.cartItems[existingItemIndex].quantity += quantity;
            cart.cartItems[existingItemIndex].totalPrice += totalPrice;
          } else {
            cart.cartItems.push({
              productId,
              supplierId,
              instructions,
              quantity,
              totalPrice,
            });
          }
          cart.totalAmount += totalPrice;
          await cart.save();
        } else {
          const newCart = new Cart({
            userId: user.id,
            cartItems: [
              {
                productId,
                supplierId,
                instructions,
                quantity,
                totalPrice,
              },
            ],
            totalAmount: totalPrice,
          });
          await newCart.save();
        }

        const count = await Cart.countDocuments({ userId: user.id });
        res.status(200).json({ status: true, count });
      } else {
        let cart = await Cart.findOne({ userId: user.id });

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
            userId: user.id,
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
        const count = await Cart.countDocuments({ userId: user.id });
        res.status(200).json({ status: true, count });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  removeFoodFromCart: async (req, res) => {
    try {
      const user = JSON.parse(req.query.user);
      const { itemId } = req.query;
      const cart = await Cart.findOne({ userId: user?._id });

      if (user.userType === "Vendor") {
        if (!cart) {
          return res.status(404).json({ message: "Cart not found" });
        }

        const itemToRemove = cart.cartItems.find(
          (item) => item.productId._id.toString() === itemId
        );
        if (!itemToRemove) {
          return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.cartItems = cart.cartItems.filter(
          (item) => item.productId._id.toString() !== itemId
        );
        cart.totalAmount -= itemToRemove.totalPrice;

        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });
      } else {
        if (!cart) {
          return res.status(404).json({ message: "Cart not found" });
        }

        const itemToRemove = cart.cartItems.find(
          (item) => item.foodId._id.toString() === itemId
        );
        if (!itemToRemove) {
          return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.cartItems = cart.cartItems.filter(
          (item) => item.foodId._id.toString() !== itemId
        );
        cart.totalAmount -= itemToRemove.totalPrice;

        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  getCartItems: async (req, res) => {
    const userId = req.user.id;

    try {
      const cart = await Cart.findOne({ userId })
        .populate("cartItems.foodId")
        .populate("cartItems.productId");

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
    const user = req.user;
    const userId = user.id;
    const itemId = req.params.id;

    try {
      let cart = await Cart.findOne({ userId });

      if (user.userType === "Vendor") {
        const existingItemIndex = cart.cartItems.findIndex(
          (item) => item.productId._id.toString() === itemId
        );

        if (existingItemIndex > -1) {
          const item = cart.cartItems[existingItemIndex];
          item.quantity += 1;
          item.totalPrice += item.productId.price;
          cart.totalAmount += item.productId.price;

          await cart.save();
          return res.status(200).json({
            status: true,
            message: "Quantity incremented successfully",
          });
        } else {
          return res
            .status(404)
            .json({ status: false, message: "Item not found in cart" });
        }
      } else {
        const existingItemIndex = cart.cartItems.findIndex(
          (item) => item.foodId._id.toString() === itemId
        );

        if (existingItemIndex > -1) {
          const item = cart.cartItems[existingItemIndex];
          item.quantity += 1;
          item.totalPrice += item.foodId.price;
          cart.totalAmount += item.foodId.price;

          await cart.save();
          return res.status(200).json({
            status: true,
            message: "Quantity incremented successfully",
          });
        } else {
          return res
            .status(404)
            .json({ status: false, message: "Item not found in cart" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  decrementCartItemQuantity: async (req, res) => {
    const user = req.user;
    const userId = req.user.id;
    const itemId = req.params.id;

    try {
      let cart = await Cart.findOne({ userId });

      if (user.userType === "Vendor") {
        if (cart) {
          const existingItemIndex = cart.cartItems.findIndex(
            (item) => item.productId._id.toString() === itemId
          );

          if (existingItemIndex > -1) {
            const item = cart.cartItems[existingItemIndex];
            if (item.quantity > 1) {
              item.quantity -= 1;
              item.totalPrice -= item.productId.price;
              cart.totalAmount -= item.productId.price;

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
      } else {
        if (cart) {
          const existingItemIndex = cart.cartItems.findIndex(
            (item) => item.foodId._id.toString() === itemId
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
