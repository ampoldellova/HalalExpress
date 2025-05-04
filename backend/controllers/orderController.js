const { Expo } = require("expo-server-sdk");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

module.exports = {
  checkoutOrder: async (req, res) => {
    const userId = req.user.id;
    const {
      restaurant,
      supplier,
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
        supplier,
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

      const populatedOrder = await Order.findById(newOrder._id)
        .populate("restaurant")
        .populate("supplier");

      cart.cartItems = [];
      cart.totalAmount = 0;
      await cart.save();

      try {
        const message = `Order placed successfully! Total: ${totalAmount}`;

        const user = await User.findById(req.user.id);
        const expo = new Expo();
        const pushToken = user.notificationToken;
        console.log(pushToken);

        if (Expo.isExpoPushToken(pushToken)) {
          const messages = [
            {
              to: pushToken,
              sound: "default",
              body: message,
              data: newOrder,
            },
          ];

          await expo.sendPushNotificationsAsync(messages);
        } else {
          console.error("Invalid Expo push token:", pushToken);
        }
      } catch (error) {
        console.log(error.message);
      }

      res.status(200).json({
        status: true,
        message: "Order placed successfully",
        order: populatedOrder,
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

      if (order.orderStatus === "Cancelled by customer") {
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

      order.orderStatus = "Cancelled by customer";
      await order.save();

      res
        .status(200)
        .json({ status: true, message: "Order cancelled successfully", order });
    } catch (error) {
      // console.log(error);
      res.status(500).json({ status: false, message: error });
    }
  },

  receiveOrder: async (req, res) => {
    const userId = req.user.id;
    const { orderId } = req.body;

    try {
      const order = await Order.findOne({ _id: orderId, userId });

      if (!order) {
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      if (order.orderStatus === "Completed") {
        return res.status(400).json({
          status: false,
          message: "Order is already marked as Completed",
        });
      }

      order.orderStatus = "Completed";
      await order.save();

      res.status(200).json({
        status: true,
        message: "Order status updated to Completed successfully",
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
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

  getRestaurantReviews: async (req, res) => {
    const { restaurantId } = req.params;

    try {
      const reviews = await Order.find({
        restaurant: restaurantId,
        "rating.status": "submitted",
      }).select("rating userId createdAt");

      if (!reviews || reviews.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No reviews found for this restaurant",
        });
      }

      res.status(200).json({
        status: true,
        message: "Reviews fetched successfully",
        reviews,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  getStoreOrders: async (req, res) => {
    const { storeId } = req.params;
    // console.log(restaurantId);
    try {
      const orders = await Order.find({
        $or: [{ restaurant: storeId }, { supplier: storeId }],
      }).sort({
        createdAt: -1,
      });

      if (!orders || orders.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No orders found",
        });
      }

      res.status(200).json({
        status: true,
        message: "Orders fetched successfully",
        orders,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  },

  rejectOrder: async (req, res) => {
    const { orderId } = req.body;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      if (order.orderStatus === "Rejected") {
        return res.status(400).json({
          status: false,
          message: "Order is already marked as Rejected",
        });
      }

      if (order.paymentStatus === "Paid") {
        order.paymentStatus = "Refunded";
      }

      if (order.paymentStatus === "Pending") {
        order.paymentStatus = "Cancelled";
      }

      order.orderStatus = "Rejected";
      await order.save();

      res.status(200).json({
        status: true,
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  acceptOrder: async (req, res) => {
    const { orderId } = req.body;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      if (order.orderStatus === "Preparing") {
        return res.status(400).json({
          status: false,
          message: "Order is already marked as Preparing",
        });
      }

      order.orderStatus = "Preparing";
      await order.save();

      res.status(200).json({
        status: true,
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  markOrderAsReady: async (req, res) => {
    const { orderId } = req.body;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      if (order.orderStatus === "Ready for pickup") {
        return res.status(400).json({
          status: false,
          message: "Order is already marked as Ready for pickup",
        });
      }

      order.orderStatus = "Ready for pickup";
      await order.save();

      res.status(200).json({
        status: true,
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
