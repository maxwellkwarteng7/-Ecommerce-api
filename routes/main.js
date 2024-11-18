const express = require('express'); 
const validateToken = require('../middlewares/tokenValidator');
const { home } = require('../controllers/main');
const router = express.Router(); 


router.get('/home', validateToken, home); 



module.exports = router; 