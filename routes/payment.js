const express = require('express'); 
const {  initializePayment, verifyPayment, paystackwebhook, initialiazeStripePayment, verifyStripePayment } = require('../controllers/payment');
const router = express.Router(); 


 
router.post('/paystack/initiate-payment', initializePayment); 

router.post('/paystack/verify-payment/:reference', verifyPayment); 
router.post('/paystack/webhook', paystackwebhook); 
router.post('/stripe/initiate-payment', initialiazeStripePayment);
router.post('/stripe/verify-payment/:sessionId', verifyStripePayment);




module.exports = router; 