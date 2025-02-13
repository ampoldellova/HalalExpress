const router = require('express').Router();
const cartController = require('../controllers/cartController')
const { verifyAndAuthorization } = require('../middleware/verifyToken')

router.post('/', verifyAndAuthorization, cartController.addFoodToCart)
router.get('/', verifyAndAuthorization, cartController.getCartItems)
router.get('/increment/:id', verifyAndAuthorization, cartController.incrementCartItemQuantity);

module.exports = router;