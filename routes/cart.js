const express = require('express'); 
const validateToken = require('../middlewares/tokenValidator');
const { addToCart, userCart, removeFromCart, clearCart } = require('../controllers/cart');
const router = express.Router(); 


router.use(validateToken); 
router.post('/', addToCart);
router.get('/', userCart); 
router.delete('/:productId', removeFromCart);
router.delete('/clearCart', clearCart); 












module.exports = router; 