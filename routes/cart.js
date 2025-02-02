const express = require('express'); 
const validateToken = require('../middlewares/tokenValidator');
const { addToCart } = require('../controllers/cart');
const router = express.Router(); 


router.post('/' , validateToken, addToCart);












module.exports = router; 