const express = require('express');
const { createCategory, updateCategory, deleteCategory, categoryProducts } = require('../controllers/category');
const upload = require('../middlewares/upload');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

//routes 
router.get('/:categoryId', categoryProducts);

router.use(adminMiddleware);
// authenticated routes (admin and super admin only); 
router.post('/', upload.single('category_image'), createCategory);
router.put('/:id', upload.single('category_image') , updateCategory);
router.delete('/:id', deleteCategory);




module.exports = router; 