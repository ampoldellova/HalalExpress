const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/register", authController.createUser);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.loginUser);

module.exports = router;
