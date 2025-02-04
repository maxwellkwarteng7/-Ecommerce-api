const express = require('express'); 
const {  initializePayment, verifyPayment } = require('../controllers/paystack');
const validateToken = require('../middlewares/tokenValidator');
const router = express.Router();


 
router.post('/initialize-payment', initializePayment); 

router.get('/verify-payment/:reference',verifyPayment); 


module.exports = router; 