// File: routes/registrationsRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllRegistrations,
  getRegistrationsByEventId,
  getRegistrationsByEventName,
  getRegistrationById,
  updateRegistrationStatus
} = require('../controllers/registrationsController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all registrations (admin/lead access)
router.get('/', authMiddleware, getAllRegistrations);

// Get registration by ID
router.get('/:id', authMiddleware, getRegistrationById);

// Get registrations by event ID
router.get('/event/:eventId', authMiddleware, getRegistrationsByEventId);

// Get registrations by event name
router.get('/by-event-name/:eventName', authMiddleware, getRegistrationsByEventName);

// Update registration status
router.put('/:id/status', authMiddleware, updateRegistrationStatus);

module.exports = router;