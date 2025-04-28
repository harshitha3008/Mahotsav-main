const express = require('express');
const router = express.Router();
const { 
  registerAdmin, 
  loginAdmin, 
  getAdminProfile 
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Register a new admin
router.post('/register', registerAdmin);

// Login admin
router.post('/login', loginAdmin);

// Get admin profile (protected route)
router.get('/profile', authMiddleware, getAdminProfile);

module.exports = router;