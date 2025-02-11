const router = require('express').Router();
const cartController = require('../controllers/cartController')
const { verifyAndAuthorization } = require('../middleware/verifyToken')

router.post('/', verifyAndAuthorization, cartController.addFoodToCart)
router.put('/increment', verifyAndAuthorization, cartController.incrementFoodItemQuantity)
router.put('/decrement', verifyAndAuthorization, cartController.decrementFoodItemQuantity)
// router.post('/decrement', verifyAndAuthorization, cartController.decrementProductQuantity)
// router.delete('/delete/:id', verifyAndAuthorization, cartController.removeProductFromCart)
router.get('/', verifyAndAuthorization, cartController.getCartItems)
// router.get('/count', verifyAndAuthorization, cartController.getCartCount)
// router.delete('/clear', verifyAndAuthorization, cartController.clearUserCart)

module.exports = router;