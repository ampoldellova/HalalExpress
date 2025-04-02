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
router.post("/rate", verifyAndAuthorization, orderController.submitRating);
router.get(
  "/restaurant/:restaurantId/reviews",
  orderController.getRestaurantReviews
);

router.get(
  "/restaurant/:restaurantId/orders",
  verifyAndAuthorization,
  orderController.getRestaurantOrders
);

module.exports = router;
