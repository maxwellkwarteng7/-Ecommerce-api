const express = require('express'); 
const {  initializePayment, verifyPayment, paystackwebhook } = require('../controllers/paystack');
const validateToken = require('../middlewares/tokenValidator');
const router = express.Router();


 
router.post('/initialize-payment', initializePayment); 

router.post('/verify-payment/:reference', verifyPayment); 
router.post('/webhook', paystackwebhook); 



module.exports = router; 