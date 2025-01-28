const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../service/cloudinary');

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Set Cloudinary folder
    public_id: (req, file) => `${Date.now()}-${file.originalname}` // Unique identifier for each file
  },
});

// File filter function
const filterFileFormat = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']; // Allowed MIME types
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // File is valid
  } else {
    cb(new Error('Invalid file type, only JPEG, PNG, and WEBP files are allowed'), false); // Reject the file
  }
};

// Initialize Multer
const upload = multer({
  storage, 
  fileFilter: filterFileFormat, 
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5 MB
  }
});

module.exports = upload;
