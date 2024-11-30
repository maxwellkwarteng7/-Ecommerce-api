const multer = require('multer'); 
const { CloudinaryStorage } = require('multer-storage-cloudinary'); 
const cloudinary = require('../service/cloudinary'); 

// create a cloudinary storage

const storage = new CloudinaryStorage({
    cloudinary: cloudinary, 
    params: {
        folder: 'uploads', 
        public_id: (req , file ) => `${Date.now()}-${file.originalname}` 
    }, 
    
}); 

// filter the file format

const filterFileFormat = (req , file , cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]; 
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('invalid file type , only jpeg , png and webp files are allowed'), false);
    }
   
}


const upload = multer({
    storage, fileFilter : filterFileFormat, limits: {
    fileSize :  5 * 1024 * 1024
    }
}); 


module.exports = upload; 