const express = require('express'); 
const { getAllProducts, postProduct, updateProduct, deleteProduct, createCategory } = require('../controllers/products');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validateToken = require('../middlewares/tokenValidator');
const upload = require('../middlewares/upload');
const router = express.Router(); 



router.get('/',  validateToken ,  getAllProducts); 
// use the admin middleware after this route 
router.use(adminMiddleware); 
router.post('/', upload.single('image'), postProduct);
router.put('/:id', updateProduct);  
router.delete('/:id',  deleteProduct); 

// create a category 
router.post('/create-category',upload.single('category_image') ,  createCategory); 



module.exports = router; 