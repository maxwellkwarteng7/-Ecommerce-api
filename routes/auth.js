const express = require('express'); 
const { register, login, logout, initiateResetPassword } = require('../controllers/auth');
const validateToken = require('../middlewares/tokenValidator');

const router = express.Router(); 


router.post('/register', register); 
router.post('/login', login); 
router.post('/logout', logout); 
router.post('/initiate-password-reset', initiateResetPassword); 








module.exports = router; 