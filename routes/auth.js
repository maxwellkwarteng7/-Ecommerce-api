const express = require('express'); 
const { register, login, logout, initiateResetPassword, resetPassword } = require('../controllers/auth');
const validateToken = require('../middlewares/tokenValidator');

const router = express.Router(); 


router.post('/register', register); 
router.post('/login', login); 
router.post('/logout', logout); 
router.post('/initiate-password-reset', initiateResetPassword); 
router.post('/reset-password', resetPassword); 








module.exports = router; 