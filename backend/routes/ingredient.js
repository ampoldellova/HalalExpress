const router = require("express").Router();
const ingredientController = require("../controllers/ingredientController");
const { verifySupplier, verifyVendor } = require("../middleware/verifyToken");
const upload = require("../utils/multer");

router.post(
  "/",
  verifySupplier,
  upload.single("imageUrl"),
  ingredientController.addIngredient
);
router.get(
  "/list",
  verifyVendor,
  upload.single("imageUrl"),
  ingredientController.getAllIngredients
);
router.get("/:id", ingredientController.getProductById);
router.patch(
  "/supplier/:supplierId",
  ingredientController.getIngredientBySupplier
);
router.patch(
  "/:id",
  verifySupplier,
  ingredientController.ingredientAvailability
);
router.delete(
  "/:id",
  verifySupplier,
  ingredientController.deleteIngredientById
);

module.exports = router;
