const express = require('express'); 
const { createCategory } = require('../controllers/category');
const upload = require('../middlewares/upload');

const router = express.Router(); 


router.post('/',upload.single('category_image') ,  createCategory); 



module.exports = router; 