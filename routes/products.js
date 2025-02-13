const express = require('express');
const { getAllProducts, postProduct, updateProduct, deleteProduct, createCategory, getProductAndReviews, createProductTag, removeTag, updateProductTag } = require('../controllers/products');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validateToken = require('../middlewares/tokenValidator');
const upload = require('../middlewares/upload');
const router = express.Router();



router.get('/', getAllProducts);
router.get('/:id', getProductAndReviews); 
// use the admin middleware after this route 
router.use(adminMiddleware);
router.post('/', upload.single('image'), postProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);
router.post('/tag', createProductTag); 
router.delete('/tag/:id', removeTag); 
router.put('/tag/:id', updateProductTag); 

// create a category 




module.exports = router; 