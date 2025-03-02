const express = require('express'); 
const { register, login, logout, initiateResetPassword, resendPin, handlePin } = require('../controllers/auth');


const router = express.Router(); 


router.post('/register', register); 
router.post('/login', login); 
router.post('/logout', logout); 
router.post('/initiate-password-reset', initiateResetPassword); 
router.post('/forgot-password', handlePin);
router.post('/verify-email', handlePin);  
router.post('/resend-pin', resendPin); 







module.exports = router; 