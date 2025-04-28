// routes/registrationRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getUserRegistrations,
  getRegistrationById,
  cancelRegistration,
  deleteRegistration,
  getAllRegistrations,
  getRegistrationsByEvent,
} = require('../controllers/registrationController');
const protect = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');

// User routes
router.post('/', protect, registerForEvent);
router.get('/', protect, getUserRegistrations);
router.get('/:id', protect, getRegistrationById);
router.put('/:id/cancel', protect, cancelRegistration);
router.delete('/:id', protect, deleteRegistration); // New route for deletion

// Admin routes
router.get('/admin', adminProtect, getAllRegistrations);
router.get('/event/:eventId', adminProtect, getRegistrationsByEvent);

module.exports = router;