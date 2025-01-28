const router = require('express').Router();
const categoryController = require('../controllers/categoryController')
const { verifyAdmin } = require('../middleware/verifyToken')

router.put('/:id', verifyAdmin, categoryController.updateCategory)
router.post('/', verifyAdmin, categoryController.createCategory)
router.delete('/:id', verifyAdmin, categoryController.deleteCategory)
router.post('/image/:id', verifyAdmin, categoryController.patchCategoryImage)
router.get('/', categoryController.getCategories)
router.get('/random', categoryController.getRandomCategories)

module.exports = router;