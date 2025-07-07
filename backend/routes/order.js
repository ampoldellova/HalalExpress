const router = require("express").Router();
const orderController = require("../controllers/orderController");
const {
  verifyAndAuthorization,
  verifyVendor,
} = require("../middleware/verifyToken");

router.post(
  "/check-out",
  verifyAndAuthorization,
  orderController.checkoutOrder
);
router.get("/", verifyAndAuthorization, orderController.getUserOrders);
router.post(
  "/cancel",
  verifyAndAuthorization,
  orderController.cancelOrderByCustomer
);
router.post("/receive", verifyAndAuthorization, orderController.receiveOrder);
router.post("/rate", verifyAndAuthorization, orderController.submitRating);
router.get("/:storeId/reviews", orderController.getStoreReviews);

router.get(
  "/store/:storeId/orders",
  verifyAndAuthorization,
  orderController.getStoreOrders
);
router.post("/reject", verifyAndAuthorization, orderController.rejectOrder);
router.post("/accept", verifyAndAuthorization, orderController.acceptOrder);
router.post(
  "/mark-as-ready",
  verifyAndAuthorization,
  orderController.markOrderAsReady
);
router.post(
  "/mark-as-out-for-delivery/:orderId",
  orderController.markOrderAsOutForDelivery
);
router.get("/accept-order/:orderId", orderController.getOrderDetails);
router.get(
  "/arrived-notification/:orderId",
  orderController.sendArrivedNotification
);
router.post(
  "/update-payment/:orderId",
  orderController.updatePaymentStatusToPaid
);
router.post("/mark-as-completed", orderController.markOrderAsCompleted);

router.get(
  "/restaurant/:restaurantId/monthly-sales",
  verifyAndAuthorization,
  orderController.getRestaurantMonthlySales
);

router.get(
  "/restaurant/:restaurantId/daily-sales",
  verifyAndAuthorization,
  orderController.getRestaurantDailySales
);

router.get(
  "/restaurant/:restaurantId/weekly-sales",
  verifyAndAuthorization,
  orderController.getRestaurantWeeklySales
);

router.get(
  "/restaurant/:restaurantId/sales/today",
  verifyAndAuthorization,
  orderController.getRestaurantDailySales
);

router.get(
  "/restaurant/:restaurantId/sales/day",
  verifyAndAuthorization,
  orderController.getRestaurantDailySales
);

router.get(
  "/restaurant/:restaurantId/sales/week",
  verifyAndAuthorization,
  orderController.getRestaurantWeeklySales
);

router.get(
  "/restaurant/:restaurantId/top-foods",
  verifyAndAuthorization,
  orderController.getTopOrderedFoods
);

router.get(
  "/store/:storeId/monthly-sales",
  verifyAndAuthorization,
  orderController.getStoreMonthlySales
);

router.get(
  "/store/:storeId/top-items",
  verifyAndAuthorization,
  orderController.getTopOrderedItems
);

router.get(
  "/store/:storeId/delivery-report",
  verifyAndAuthorization,
  orderController.getDeliveryReport
);

module.exports = router;
