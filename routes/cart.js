const express = require('express'); 
const validateToken = require('../middlewares/tokenValidator');
const { addToCart, userCart, removeFromCart } = require('../controllers/cart');
const router = express.Router(); 


router.use(validateToken); 
router.post('/', validateToken, addToCart);
router.get('/', validateToken, userCart); 
router.delete('/:productId', validateToken, removeFromCart);












module.exports = router; 