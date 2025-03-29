const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { verifyAndAuthorization } = require('../middleware/verifyToken');

router.post('/check-out', verifyAndAuthorization, orderController.checkoutOrder);
router.get('/', verifyAndAuthorization, orderController.getUserOrders);
router.post('/cancel', verifyAndAuthorization, orderController.cancelOrderByCustomer);
router.post('/rate', verifyAndAuthorization, orderController.submitRating);

module.exports = router;