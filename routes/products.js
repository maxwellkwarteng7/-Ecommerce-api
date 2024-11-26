const express = require('express'); 
const { getAllProducts, postProduct, updateProduct, deleteProduct } = require('../controllers/products');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validateToken = require('../middlewares/tokenValidator');
const router = express.Router(); 


router.get('/',  validateToken ,  getAllProducts); 
// use the admin middleware after this route
router.post('/', adminMiddleware, postProduct);
router.put('/:id', adminMiddleware, updateProduct);  
router.delete('/:id', adminMiddleware, deleteProduct); 



module.exports = router; 