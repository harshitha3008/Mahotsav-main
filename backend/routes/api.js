const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const eventController = require('../controllers/eventController');
const protect = require('../middleware/authMiddleware');// Import the verifyToken middleware
const Event = require('../models/Event'); // Import the Event model

// GET /api/events/fetchByCategory?category=Team%20Events
router.get('/fetchByCategory', async (req, res) => {
  try {
    const { category } = req.query;
    
    if (!category) {
      return res.status(400).json({ message: 'Category parameter is required' });
    }

    // Fetch events by category using Mongoose
    const events = await Event.find({ eventCategory: category })
      .select('-__v') // Exclude the version field
      .lean(); // Convert Mongoose documents to plain JS objects
    
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});



// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
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

router.get('/byAdmin', protect, eventController.getEventsByAdmin);

// Event routes
router.post('/', upload.single('image'), eventController.createEvent);

router.get('/:id', protect, eventController.getEventById);
// Add this route for updating events
router.put('/:id', protect, upload.single('image'), eventController.updateEvent);
// Add DELETE route for events
router.delete('/:id', protect, eventController.deleteEvent);
router.get('/admin/:id', protect, eventController.getAdminById);



// In your api.js file, add this:
router.get('/', (req, res) => {
  res.json({ message: 'Events API is working' });
});

module.exports = router;