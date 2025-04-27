const router = require("express").Router();
const supplierController = require("../controllers/supplierController");
const upload = require("../utils/multer");
const {
  verifyAndAuthorization,
  verifySupplier,
  verifyVendor,
} = require("../middleware/verifyToken");

router.post("/", verifySupplier, supplierController.addSupplier);
router.get(
  "/owner/:ownerId",
  verifySupplier,
  supplierController.getSupplierStoreByOwner
);
router.get("/byId/:id", supplierController.getSupplier);
router.get("/list", verifyVendor, supplierController.getAllSuppliers);
router.patch("/:id", verifySupplier, supplierController.serviceAvailability);
router.patch(
  "/pickup/:id",
  verifySupplier,
  supplierController.pickupAvailability
);
router.patch(
  "/delivery/:id",
  verifySupplier,
  supplierController.deliveryAvailability
);
router.put(
  "/:id",
  verifySupplier,
  upload.fields([
    { name: "imageUrl", maxCount: 1 },
    { name: "logoUrl", maxCount: 1 },
  ]),
  supplierController.editSupplierDetails
);

module.exports = router;
