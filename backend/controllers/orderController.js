const Order = require("../models/Order");
const Cart = require("../models/Cart");

module.exports = {
  checkoutOrder: async (req, res) => {
    const userId = req.user.id;
    const {
      restaurant,
      orderItems,
      deliveryOption,
      deliveryAddress,
      subTotal,
      deliveryFee,
      totalAmount,
      paymentId,
      paymentMethod,
      paymentStatus,
      orderStatus,
      orderNote,
    } = req.body;

    try {
      const cart = await Cart.findOne({ userId }).populate("cartItems.foodId");

      if (!cart) {
        return res
          .status(404)
          .json({ status: false, message: "Cart not found" });
      }

      const newOrder = new Order({
        userId,
        restaurant,
        orderItems,
        deliveryOption,
        deliveryAddress,
        subTotal,
        deliveryFee,
        totalAmount,
        paymentId,
        paymentMethod,
        paymentStatus,
        orderStatus,
        orderNote,
      });

      await newOrder.save();

      cart.cartItems = [];
      cart.totalAmount = 0;
      await cart.save();

      res.status(200).json({
        status: true,
        message: "Order placed successfully",
        order: newOrder,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getUserOrders: async (req, res) => {
    const userId = req.user.id;

    try {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });

      if (!orders) {
        return res
          .status(404)
          .json({ status: false, message: "No order found" });
      }

      res.status(200).json({ status: true, orders });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  cancelOrderByCustomer: async (req, res) => {
    const userId = req.user.id;
    const { orderId } = req.body;

    try {
      const order = await Order.findOne({ _id: orderId, userId });

      if (!order) {
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      if (order.orderStatus === "cancelled by customer") {
        return res
          .status(400)
          .json({ status: false, message: "Order is already cancelled" });
      }

      if (order.paymentStatus === "Paid") {
        order.paymentStatus = "Refunded";
      }

      if (order.paymentStatus === "Pending") {
        order.paymentStatus = "Cancelled";
      }

      order.orderStatus = "cancelled by customer";
      await order.save();

      res
        .status(200)
        .json({ status: true, message: "Order cancelled successfully", order });
    } catch (error) {
      // console.log(error);
      res.status(500).json({ status: false, message: error });
    }
  },

  submitRating: async (req, res) => {
    const { orderId, stars, feedback } = req.body;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      if (order.rating.status === "submitted") {
        return res.status(400).json({
          status: false,
          message: "Rating has already been submitted",
        });
      }

      order.rating = {
        stars,
        feedback,
        status: "submitted",
      };

      await order.save();

      const restaurant = order.restaurant;
      if (!restaurant) {
        return res
          .status(404)
          .json({ status: false, message: "Restaurant not found" });
      }

      const currentRating = restaurant.rating || 0;
      const currentRatingCount = parseInt(restaurant.ratingCount || 0);

      const newRatingCount = currentRatingCount + 1;
      const newRating =
        (currentRating * currentRatingCount + stars) / newRatingCount;

      restaurant.rating = newRating;
      restaurant.ratingCount = newRatingCount.toString();
      await restaurant.save();

      res.status(200).json({
        status: true,
        message: "Rating submitted successfully",
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
