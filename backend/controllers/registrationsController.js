// File: controllers/registrationsController.js
const Registration = require('../models/registrationModel');
const Event = require('../models/Event'); // Assuming you have an Event model

// @desc    Get all registrations
// @route   GET /api/registrations
// @access  Private (Admin/Lead)
exports.getAllRegistrations = async (req, res) => {
  try {
    // Check if the requester is a lead or admin
    if (req.user) {
      return res.status(403).json({ message: 'Access denied. Admin or lead role required.' });
    }

    const role = req.admin ? req.admin.role : null;
    
    if (!role || (role !== 'core' && role !== 'lead')) {
      return res.status(403).json({ message: 'Access denied. Admin or lead role required.' });
    }

    // Get all registrations with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const registrations = await Registration.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('event', 'title date');
    
    // Get total count for pagination
    const total = await Registration.countDocuments();
    
    res.json({
      registrations,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllRegistrations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get registrations by event ID
// @route   GET /api/registrations/event/:eventId
// @access  Private (Admin/Lead)
exports.getRegistrationsByEventId = async (req, res) => {
  try {
    // Check if the requester is a lead or admin
    if (req.user) {
      return res.status(403).json({ message: 'Access denied. Admin or lead role required.' });
    }

    const role = req.admin ? req.admin.role : null;
    
    if (!role || (role !== 'core' && role !== 'lead')) {
      return res.status(403).json({ message: 'Access denied. Admin or lead role required.' });
    }

    const { eventId } = req.params;
    
    // Validate eventId
    if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid event ID format' });
    }
    
    // Get registrations with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const registrations = await Registration.find({ event: eventId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('event', 'title date');
    
    // Get total count for pagination
    const total = await Registration.countDocuments({ event: eventId });
    
    res.json({
      registrations,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getRegistrationsByEventId:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get registrations by event name
// @route   GET /api/registrations/by-event-name/:eventName
// @access  Private (Admin/Lead)
exports.getRegistrationsByEventName = async (req, res) => {
  try {
    // Check if the requester is a lead or admin
    if (req.user) {
      return res.status(403).json({ message: 'Access denied. Admin or lead role required.' });
    }

    const role = req.admin ? req.admin.role : null;
    
    if (!role || (role !== 'core' && role !== 'lead')) {
      return res.status(403).json({ message: 'Access denied. Admin or lead role required.' });
    }

    const { eventName } = req.params;
    
    // First find the event by name
    const event = await Event.findOne({ 
      $or: [
        { title: { $regex: new RegExp(eventName, 'i') } },
        { 'eventDetails.eventName': { $regex: new RegExp(eventName, 'i') } }
      ]
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Get registrations for the event with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const registrations = await Registration.find({ event: event._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('event', 'title date');
    
    // Get total count for pagination
    const total = await Registration.countDocuments({ event: event._id });
    
    res.json({
      registrations,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in getRegistrationsByEventName:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get registration by ID
// @route   GET /api/registrations/:id
// @access  Private (Admin/Lead)
exports.getRegistrationById = async (req, res) => {
  try {
    // Check if the requester is a lead or admin
    if (req.user) {
      return res.status(403).json({ message: 'Access denied. Admin or lead role required.' });
    }

    const role = req.admin ? req.admin.role : null;
    
    if (!role || (role !== 'core' && role !== 'lead')) {
      return res.status(403).json({ message: 'Access denied. Admin or lead role required.' });
    }

    const registration = await Registration.findById(req.params.id)
      .populate('user', 'name email')
      .populate('event', 'title date');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    res.json(registration);
  } catch (error) {
    console.error('Error in getRegistrationById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update registration status
// @route   PUT /api/registrations/:id/status
// @access  Private (Admin/Lead)
exports.updateRegistrationStatus = async (req, res) => {
  try {
    // Check if the requester is a lead or admin
    if (req.user) {
      return res.status(403).json({ message: 'Access denied. Admin or lead role required.' });
    }

    const role = req.admin ? req.admin.role : null;
    
    if (!role || (role !== 'core' && role !== 'lead')) {
      return res.status(403).json({ message: 'Access denied. Admin or lead role required.' });
    }

    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    registration.status = status;
    await registration.save();
    
    res.json(registration);
  } catch (error) {
    console.error('Error in updateRegistrationStatus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};