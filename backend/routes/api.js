const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { S3Client } = require('@aws-sdk/client-s3'); // AWS SDK v3
require('dotenv').config(); // To access the environment variables
const eventController = require('../controllers/eventController');
const protect = require('../middleware/authMiddleware'); // Import the verifyToken middleware
const Event = require('../models/Event'); // Import the Event model

// Initialize AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer with AWS S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME, // The bucket name where images will be uploaded
    // acl: 'public-read', // Permissions for the uploaded file
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'events/' + uniqueSuffix + ext); // The folder name inside the S3 bucket
    }
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Event routes
router.get('/fetchByCategory', async (req, res) => {
  try {
    const { category } = req.query;
    
    if (!category) {
      return res.status(400).json({ message: 'Category parameter is required' });
    }

    const events = await Event.find({ eventCategory: category })
      .select('-__v') // Exclude the version field
      .lean(); // Convert Mongoose documents to plain JS objects
    
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Event routes
router.post('/', upload.single('image'), eventController.createEvent);
router.put('/:id', protect, upload.single('image'), eventController.updateEvent);

// Admin routes
router.get('/byAdmin', protect, eventController.getEventsByAdmin);
router.get('/:id', protect, eventController.getEventById);
router.delete('/:id', protect, eventController.deleteEvent);
router.get('/admin/:id', protect, eventController.getAdminById);

// Health check route
router.get('/', (req, res) => {
  res.json({ message: 'Events API is working' });
});

module.exports = router;
