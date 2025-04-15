const VendorCart = require("../models/VendorCart");
const { decrementCartItemQuantity } = require("./cartController");

module.exports = {
  addProductToCart: async (req, res) => {
    const userId = req.user.id;
    const { productId, totalPrice, quantity, instructions, supplierId } =
      req.body;

    try {
      let vendorCart = await VendorCart.findOne({ userId });

      if (vendorCart) {
        const differentRestaurantItemIndex = vendorCart.cartItems.findIndex(
          (item) => item.productId.supplier.toString() !== supplierId
        );
        if (differentRestaurantItemIndex > -1) {
          vendorCart.cartItems = vendorCart.cartItems.filter(
            (item) => item.productId.supplier.toString() === supplierId
          );
          vendorCart.totalAmount = 0;
        }

        const existingItemIndex = vendorCart.cartItems.findIndex(
          (item) => item.productId._id.toString() === productId
        );

        if (existingItemIndex > -1) {
          vendorCart.cartItems[existingItemIndex].quantity += quantity;
          vendorCart.cartItems[existingItemIndex].totalPrice += totalPrice;
        } else {
          vendorCart.cartItems.push({
            productId,
            supplierId,
            instructions,
            quantity,
            totalPrice,
          });
        }

        vendorCart.totalAmount += totalPrice;
        await vendorCart.save();
      } else {
        const newCart = new VendorCart({
          userId,
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

      const count = await VendorCart.countDocuments({ userId });
      res.status(200).json({ status: true, count });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getCartItems: async (req, res) => {
    const userId = req.user.id;

    try {
      const vendorCart = await VendorCart.findOne({ userId }).populate(
        "cartItems.productId"
      );

      if (!vendorCart) {
        return res
          .status(404)
          .json({ status: false, message: "Cart not found" });
      }

      res
        .status(200)
        .json({
          status: true,
          cartItems: vendorCart.cartItems,
          vendorCart: vendorCart,
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  removeProductFromCart: async (req, res) => {
    try {
      const { userId, productId } = req.query;

      const vendorCart = await VendorCart.findOne({ userId });
      if (!vendorCart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const itemToRemove = vendorCart.cartItems.find(
        (item) => item.productId._id.toString() === productId
      );
      if (!itemToRemove) {
        return res.status(404).json({ message: "Food item not found in cart" });
      }

      vendorCart.cartItems = vendorCart.cartItems.filter(
        (item) => item.productId._id.toString() !== productId
      );
      vendorCart.totalAmount -= itemToRemove.totalPrice;

      await vendorCart.save();
      res
        .status(200)
        .json({ message: "Product item removed from cart", vendorCart });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  decrementCartItemQuantity: async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;

    try {
      let vendorCart = await VendorCart.findOne({ userId });

      if (vendorCart) {
        const existingItemIndex = vendorCart.cartItems.findIndex(
          (item) => item.productId._id.toString() === productId
        );

        if (existingItemIndex > -1) {
          const item = vendorCart.cartItems[existingItemIndex];
          if (item.quantity > 1) {
            item.quantity -= 1;
            item.totalPrice -= item.productId.price;
            vendorCart.totalAmount -= item.productId.price;

            await vendorCart.save();
            return res
              .status(200)
              .json({
                status: true,
                message: "Quantity decremented successfully",
              });
          } else {
            return res
              .status(400)
              .json({
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

  incrementCartItemQuantity: async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;

    try {
      let vendorCart = await VendorCart.findOne({ userId });

      if (vendorCart) {
        const existingItemIndex = vendorCart.cartItems.findIndex(
          (item) => item.productId._id.toString() === productId
        );

        if (existingItemIndex > -1) {
          const item = vendorCart.cartItems[existingItemIndex];
          item.quantity += 1;
          item.totalPrice += item.productId.price;
          vendorCart.totalAmount += item.productId.price;

          await vendorCart.save();
          return res
            .status(200)
            .json({
              status: true,
              message: "Quantity incremented successfully",
            });
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
};
