const { Expo } = require("expo-server-sdk");
const Restaurant = require("../models/Restaurant");
const Supplier = require("../models/Supplier");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const mongoose = require("mongoose");

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
        const target = await (restaurant
          ? Restaurant.findById(restaurant)
          : Supplier.findById(supplier));

        console.log(target.owner.notificationToken);
        if (target && target.owner.notificationToken) {
          const expo = new Expo();
          const pushToken = target.owner.notificationToken;

          if (Expo.isExpoPushToken(pushToken)) {
            const message = {
              to: pushToken,
              sound: "default",
              title: `${target.title} - New Order Received`,
              body: `You have received a new order. Order ID: ${newOrder._id}`,
            };

            await expo.sendPushNotificationsAsync([message]);
          } else {
            console.error("Invalid Expo push token:", pushToken);
          }
        } else {
          console.error("Notification token not found for the target entity.");
        }
      } catch (notificationError) {
        console.error("Error sending notification:", notificationError.message);
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
      console.log(error);
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
    const user = req.user;

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

      if (user.userType === "Vendor") {
        const supplier = order.supplier;
        if (!supplier) {
          return res
            .status(404)
            .json({ status: false, message: "Supplier not found" });
        }

        const currentRating = supplier.rating || 0;
        const currentRatingCount = parseInt(supplier.ratingCount || 0);

        const newRatingCount = currentRatingCount + 1;
        const newRating =
          (currentRating * currentRatingCount + stars) / newRatingCount;

        supplier.rating = newRating;
        supplier.ratingCount = newRatingCount.toString();
        await supplier.save();

        res.status(200).json({
          status: true,
          message: "Rating submitted successfully",
          order,
        });
      } else {
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
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getStoreReviews: async (req, res) => {
    const { storeId } = req.params;

    try {
      const reviews = await Order.find({
        $or: [{ restaurant: storeId }, { supplier: storeId }],
        "rating.status": "submitted",
      }).select("rating userId createdAt");

      if (!reviews || reviews.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No reviews found for this store",
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

      try {
        const message = `Your order ${orderId} has been accepted and is now being prepared.`;

        const user = await User.findById(order.userId._id);
        const expo = new Expo();
        const pushToken = user.notificationToken;

        if (Expo.isExpoPushToken(pushToken)) {
          const messages = [
            {
              to: pushToken,
              sound: "default",
              title: `Order Notification`,
              body: message,
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

  getOrderDetails: async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await Order.findById(orderId)
        .populate("restaurant")
        .populate("supplier")
        .populate("userId");

      if (!order) {
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      res.status(200).json({
        status: true,
        message: "Order details fetched successfully",
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  markOrderAsOutForDelivery: async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      if (order.orderStatus === "Out for delivery") {
        return res.status(400).json({
          status: false,
          message: "Order is already marked as Out for delivery",
        });
      }

      order.orderStatus = "Out for delivery";
      await order.save();

      try {
        const message = `Your order ${orderId} is out for delivery.`;
        const user = await User.findById(order.userId._id);
        const expo = new Expo();
        const pushToken = user.notificationToken;

        if (Expo.isExpoPushToken(pushToken)) {
          const messages = [
            {
              to: pushToken,
              sound: "default",
              title: `Order Notification`,
              body: message,
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
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  sendArrivedNotification: async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      if (order.orderStatus === "Delivered") {
        return res.status(400).json({
          status: false,
          message: "Order is already marked as Delivered",
        });
      }

      order.orderStatus = "Delivered";
      await order.save();

      const message = `Your order ${orderId} has arrived at your location, please pickup your order.`;
      const user = await User.findById(order.userId._id);
      const expo = new Expo();
      const pushToken = user.notificationToken;
      if (Expo.isExpoPushToken(pushToken)) {
        const messages = [
          {
            to: pushToken,
            sound: "default",
            title: `Order Notification`,
            body: message,
          },
        ];
        await expo.sendPushNotificationsAsync(messages);
      } else {
        console.error("Invalid Expo push token:", pushToken);
      }

      res.status(200).json({
        status: true,
        message: "Notification sent successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  updatePaymentStatusToPaid: async (req, res) => {
    const { orderId } = req.params;

    try {
      const order = await Order.findById(orderId);

      if (!order) {
        return res
          .status(404)
          .json({ status: false, message: "Order not found" });
      }

      if (order.paymentStatus === "Paid") {
        return res.status(400).json({
          status: false,
          message: "Order is already paid by the customer",
        });
      }

      order.paymentStatus = "Paid";
      await order.save();

      const message = `${orderId} cash on delivery payment has been confirmed. Thank you for your order!`;
      const user = await User.findById(order.userId._id);
      const expo = new Expo();
      const pushToken = user.notificationToken;
      if (Expo.isExpoPushToken(pushToken)) {
        const messages = [
          {
            to: pushToken,
            sound: "default",
            title: `Order Notification`,
            body: message,
          },
        ];
        await expo.sendPushNotificationsAsync(messages);
      } else {
        console.error("Invalid Expo push token:", pushToken);
      }

      res.status(200).json({
        status: true,
        message: "Order payment status updated successfully",
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  markOrderAsCompleted: async (req, res) => {
    const { orderId } = req.body;

    try {
      const order = await Order.findById(orderId);

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
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRestaurantMonthlySales: async (req, res) => {
    const { restaurantId } = req.params;
    try {
      const sales = await Order.aggregate([
        {
          $match: {
            restaurant: new mongoose.Types.ObjectId(restaurantId),
            orderStatus: "Completed",
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalSales: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const salesWithMonthName = sales.map((item) => ({
        year: item._id.year,
        month: monthNames[item._id.month - 1],
        totalSales: item.totalSales,
        orderCount: item.orderCount,
      }));

      res.status(200).json({ status: true, sales: salesWithMonthName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getTopOrderedFoods: async (req, res) => {
    const { restaurantId } = req.params;
    try {
      const topFoods = await Order.aggregate([
        {
          $match: {
            restaurant: new mongoose.Types.ObjectId(restaurantId),
            orderStatus: "Completed",
            paymentStatus: "Paid",
          },
        },
        { $unwind: "$orderItems" },
        {
          $group: {
            _id: "$orderItems.foodId",
            totalOrdered: { $sum: "$orderItems.quantity" },
          },
        },
        { $sort: { totalOrdered: -1 } },
        { $limit: 3 },
        {
          $lookup: {
            from: "foods",
            localField: "_id",
            foreignField: "_id",
            as: "food",
          },
        },
        { $unwind: "$food" },
        {
          $project: {
            foodId: "$food._id",
            title: "$food.title",
            totalOrdered: 1,
          },
        },
      ]);
      res.status(200).json({ status: true, topFoods });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getStoreMonthlySales: async (req, res) => {
    const { storeId } = req.params;
    try {
      const sales = await Order.aggregate([
        {
          $match: {
            supplier: new mongoose.Types.ObjectId(storeId),
            orderStatus: "Completed",
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalSales: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const salesWithMonthName = sales.map((item) => ({
        year: item._id.year,
        month: monthNames[item._id.month - 1],
        totalSales: item.totalSales,
        orderCount: item.orderCount,
      }));

      res.status(200).json({ status: true, sales: salesWithMonthName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getTopOrderedItems: async (req, res) => {
    const { storeId } = req.params;
    try {
      const topItems = await Order.aggregate([
        {
          $match: {
            supplier: new mongoose.Types.ObjectId(storeId),
            orderStatus: "Completed",
            paymentStatus: "Paid",
          },
        },
        { $unwind: "$orderItems" },
        {
          $group: {
            _id: "$orderItems.productId",
            totalOrdered: { $sum: "$orderItems.quantity" },
          },
        },
        { $sort: { totalOrdered: -1 } },
        { $limit: 3 },
        {
          $lookup: {
            from: "ingredients",
            localField: "_id",
            foreignField: "_id",
            as: "ingredient",
          },
        },
        { $unwind: "$ingredient" },
        {
          $project: {
            productId: "$ingredient._id",
            title: "$ingredient.title",
            totalOrdered: 1,
          },
        },
      ]);
      res.status(200).json({ status: true, topItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRestaurantDailySales: async (req, res) => {
    const { restaurantId } = req.params;
    const { date } = req.query;

    try {
      let targetDate;
      if (date) {
        targetDate = new Date(date);
      } else {
        targetDate = new Date(); 
      }

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const sales = await Order.aggregate([
        {
          $match: {
            restaurant: new mongoose.Types.ObjectId(restaurantId),
            orderStatus: "Completed",
            paymentStatus: "Paid",
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            totalSales: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const hourlyData = [];
      for (let hour = 0; hour < 24; hour++) {
        const existingData = sales.find((item) => item._id === hour);
        
        // Format hour to AM/PM
        let displayPeriod;
        if (hour === 0) {
          displayPeriod = "12:00 AM";
        } else if (hour < 12) {
          displayPeriod = `${hour}:00 AM`;
        } else if (hour === 12) {
          displayPeriod = "12:00 PM";
        } else {
          displayPeriod = `${hour - 12}:00 PM`;
        }
        
        hourlyData.push({
          period: displayPeriod,
          totalSales: existingData ? existingData.totalSales : 0,
          orderCount: existingData ? existingData.orderCount : 0,
          hour: hour,
          isPastHour: hour <= new Date().getHours(),
        });
      }

      res.status(200).json({ status: true, sales: hourlyData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getRestaurantWeeklySales: async (req, res) => {
    const { restaurantId } = req.params;

    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6); // Last 7 days including today
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(today);
      endOfWeek.setHours(23, 59, 59, 999);

      const sales = await Order.aggregate([
        {
          $match: {
            restaurant: new mongoose.Types.ObjectId(restaurantId),
            orderStatus: "Completed",
            paymentStatus: "Paid",
            createdAt: {
              $gte: startOfWeek,
              $lte: endOfWeek,
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            totalSales: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]);

      // Fill in missing days with 0 sales
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const existingData = sales.find(
          (item) =>
            item._id.year === date.getFullYear() &&
            item._id.month === date.getMonth() + 1 &&
            item._id.day === date.getDate()
        );

        weeklyData.push({
          period: date.toLocaleDateString("en-US", { weekday: "short" }),
          totalSales: existingData ? existingData.totalSales : 0,
          orderCount: existingData ? existingData.orderCount : 0,
          date: date.toDateString(),
          isToday: i === 0,
        });
      }

      res.status(200).json({ status: true, sales: weeklyData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getSupplierDailySales: async (req, res) => {
    const { storeId } = req.params;
    const { date } = req.query; 

    try {
      let targetDate;
      if (date) {
        targetDate = new Date(date);
      } else {
        targetDate = new Date(); 
      }

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const sales = await Order.aggregate([
        {
          $match: {
            supplier: new mongoose.Types.ObjectId(storeId),
            orderStatus: "Completed",
            paymentStatus: "Paid",
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            totalSales: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const hourlyData = [];
      for (let hour = 0; hour < 24; hour++) {
        const existingData = sales.find((item) => item._id === hour);
        
        // Format hour to AM/PM
        let displayPeriod;
        if (hour === 0) {
          displayPeriod = "12:00 AM";
        } else if (hour < 12) {
          displayPeriod = `${hour}:00 AM`;
        } else if (hour === 12) {
          displayPeriod = "12:00 PM";
        } else {
          displayPeriod = `${hour - 12}:00 PM`;
        }
        
        hourlyData.push({
          period: displayPeriod,
          totalSales: existingData ? existingData.totalSales : 0,
          orderCount: existingData ? existingData.orderCount : 0,
          hour: hour,
          isPastHour: hour <= new Date().getHours(),
        });
      }

      res.status(200).json({ status: true, sales: hourlyData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getSupplierWeeklySales: async (req, res) => {
    const { storeId } = req.params;

    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      const sales = await Order.aggregate([
        {
          $match: {
            supplier: new mongoose.Types.ObjectId(storeId),
            orderStatus: "Completed",
            paymentStatus: "Paid",
            createdAt: {
              $gte: sevenDaysAgo,
              $lte: today,
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            totalSales: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]);

      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const existingData = sales.find(
          (item) =>
            item._id.year === date.getFullYear() &&
            item._id.month === date.getMonth() + 1 &&
            item._id.day === date.getDate()
        );

        weeklyData.push({
          period: date.toLocaleDateString("en-US", { weekday: "short" }),
          totalSales: existingData ? existingData.totalSales : 0,
          orderCount: existingData ? existingData.orderCount : 0,
          date: date.toDateString(),
          isToday: i === 0,
        });
      }

      res.status(200).json({ status: true, sales: weeklyData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message });
    }
  },
};
