const express = require('express');

const { getAllProducts, postProduct, updateProduct, deleteProduct, createProductTag, removeTag, updateProductTag, getProductByTag, getSingleProduct } = require('../controllers/products');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validateToken = require('../middlewares/tokenValidator');
const upload = require('../middlewares/upload');
const router = express.Router();


router.get('/tag/products', getProductByTag); 
router.get('/', getAllProducts);
router.get('/:id', getSingleProduct); 

// use the admin middleware after this route 
router.use(adminMiddleware);
router.post('/', upload.single('image'), postProduct);
router.patch('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);
router.post('/tag', createProductTag); 
router.delete('/tag/:id', removeTag); 
router.patch('/tag/:id', updateProductTag); 


module.exports = router; 