const express = require('express'); 
const validateToken = require('../middlewares/tokenValidator');
const { addToCart, userCart } = require('../controllers/cart');
const router = express.Router(); 


router.post('/', validateToken, addToCart);
router.get('/' , validateToken , userCart ); 












module.exports = router; 