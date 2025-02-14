const express = require('express');

const { getAllProducts, postProduct, updateProduct, deleteProduct, getProductAndReviews, createProductTag, removeTag, updateProductTag, getProductByTag } = require('../controllers/products');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validateToken = require('../middlewares/tokenValidator');
const upload = require('../middlewares/upload');
const router = express.Router();



router.get('/', getAllProducts);
router.get('/:id', getProductAndReviews); 
router.get('/tag/products', getProductByTag); 
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