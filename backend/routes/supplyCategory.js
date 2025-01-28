const router = require('express').Router();
const supplyCategoryController = require('../controllers/supplyCategoryController')
const { verifyAdmin, verifyVendor, verifySupplier } = require('../middleware/verifyToken')

router.post('/', verifyAdmin, supplyCategoryController.createSupplyCategory)
router.get('/', supplyCategoryController.getSupplyCategories)

module.exports = router;