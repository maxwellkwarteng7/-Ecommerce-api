const express = require('express'); 
const { pay, initializePayment } = require('../controllers/paystack');
const validateToken = require('../middlewares/tokenValidator');
const router = express.Router();



router.post('/pay', validateToken , initializePayment); 


module.exports = router; 