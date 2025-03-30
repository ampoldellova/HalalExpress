const router = require("express").Router();
const authController = require("../controllers/authController");
const multer = require("../middleware/multerConfig");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);

module.exports = router;
