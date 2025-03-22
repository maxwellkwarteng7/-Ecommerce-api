const express = require('express');
const { createCategory, updateCategory, deleteCategory, allCategories, getCategoryProducts } = require('../controllers/category');
const upload = require('../middlewares/upload');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

//routes 
router.get('/:categoryId', getCategoryProducts);


// authenticated routes (admin and super admin only); 
router.get('/', allCategories); 
router.use(adminMiddleware);
router.post('/', upload.single('category_image'), createCategory);
router.patch('/:id', upload.single('category_image') , updateCategory);
router.delete('/:id', deleteCategory);




module.exports = router; 