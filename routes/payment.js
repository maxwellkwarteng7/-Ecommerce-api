const express = require('express'); 
const {  initializePayment } = require('../controllers/paystack');
const validateToken = require('../middlewares/tokenValidator');
const router = express.Router();



router.post('/initialize-payment', validateToken, initializePayment); 

router.get('/verify-payment/:reference',); 


module.exports = router; 