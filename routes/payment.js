const express = require('express'); 
const {  initializePayment, verifyPayment, paystackwebhook, initialiazeStripePayment } = require('../controllers/payment');
const router = express.Router(); 


 
router.post('/paystack/initialize-payment', initializePayment); 

router.post('/paystack/verify-payment/:reference', verifyPayment); 
router.post('/paystack/webhook', paystackwebhook); 
router.post('/stripe/initiate-payment', initialiazeStripePayment);
router.get('/stripe/verify-payment/:sessionId', verifyPayment);




module.exports = router; 