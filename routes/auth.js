const express = require('express'); 
const { register, login, logout, initiateResetPassword, sendOneTimePin, resendPin } = require('../controllers/auth');


const router = express.Router(); 


router.post('/register', register); 
router.post('/login', login); 
router.post('/logout', logout); 
router.post('/initiate-password-reset', initiateResetPassword); 
router.post('/reset-password', sendOneTimePin);
router.post('/verify-email', sendOneTimePin);  
router.post('/resend-pin', resendPin); 
router.get('/user-profile'); 






module.exports = router; 