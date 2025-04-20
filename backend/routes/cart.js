const router = require("express").Router();
const cartController = require("../controllers/cartController");
const {
  verifyAndAuthorization,
  verifyToken,
} = require("../middleware/verifyToken");

router.post("/", verifyAndAuthorization, cartController.addItemToCart);
router.get("/", verifyAndAuthorization, cartController.getCartItems);
router.delete(
  "/remove-food",
  verifyAndAuthorization,
  cartController.removeFoodFromCart
);
router.patch(
  "/increment/:id",
  verifyAndAuthorization,
  cartController.incrementCartItemQuantity
);
router.patch(
  "/decrement/:id",
  verifyAndAuthorization,
  cartController.decrementCartItemQuantity
);
router.delete("/clear-cart", verifyAndAuthorization, cartController.clearCart);

module.exports = router;
