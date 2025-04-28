// controllers/registrationController.js
const Registration = require('../models/registrationModel');
const Event = require('../models/Event');
// const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Modified generateRegistrationId function
const generateRegistrationId = async (eventCategory, subCategory, userMHID, eventName) => {
  console.log("Values received in generateRegistrationId:", { 
    eventCategory, 
    subCategory, 
    userMHID,
    eventName 
  });
  
  // Use the user's MHID as the prefix
  const prefix = userMHID || 'MH000'; // Fallback if MHID is not available
  console.log("Prefix being used:", prefix);
  
  // Get the count of registrations for this specific event
  let count = await Registration.countDocuments({
    'eventDetails.eventName': eventName
  });
  
  // Increment by 1 for the new registration
  count += 1;
  
  // Create a simplified event name for the ID (remove spaces, special chars)
  let formattedEventName = eventName
    .trim()
    .replace(/[^\w\s]/gi, '') // Remove special characters
    .replace(/\s+/g, ''); // Remove spaces
  
  // Limit the length of the event name in the ID
  if (formattedEventName.length > 15) {
    formattedEventName = formattedEventName.substring(0, 15);
  }
  
  // Combine parts to create the readable registration ID
  const registrationId = `${prefix} - ${formattedEventName}`;
  
  console.log("Generated registration ID:", registrationId);
  return registrationId;
};

// Update the registerForEvent function to pass eventName to generateRegistrationId
const registerForEvent = asyncHandler(async (req, res) => {
  const { eventId, eventName, eventCategory, subCategory, userId, name, phone } = req.body;

  // Enhanced debugging for request data
  console.log("Request body:", req.body);
  console.log("UserId from request:", userId);
  console.log("Event category received:", eventCategory);
  console.log("Subcategory received:", subCategory);
  console.log("Event name received:", eventName);
  
  // Validate event existence
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  // Check if user has already registered for this event
  const existingRegistration = await Registration.findOne({
    user: req.user._id,
    event: eventId,
  });
  
  if (existingRegistration) {
    res.status(400);
    throw new Error('You have already registered for this event');
  }
  
  // Use the MHID from the request body
  const userMHID = userId; // This should be the MHID from localStorage
  
  // Standardize the category values
  const standardizedCategory = eventCategory.toLowerCase() === 'sports' ? 'Sports' : 
                              (eventCategory.toLowerCase() === 'cultural' ? 'cultural' : eventCategory);
  
  const standardizedSubCategory = subCategory || 'no category';
  
  console.log("Standardized values:", {
    category: standardizedCategory,
    subCategory: standardizedSubCategory
  });
  
  // Generate a unique registration ID using the standardized values and event name
  const registrationId = await generateRegistrationId(
    standardizedCategory, 
    standardizedSubCategory, 
    userMHID,
    eventName
  );
  
  // Create registration record
  const registration = await Registration.create({
    user: req.user._id,
    event: eventId,
    registrationId,
    eventDetails: {
      eventName,
      eventCategory: standardizedCategory,
      subCategory: standardizedSubCategory,
    },
    userDetails: {
      userId, // MHID
      name,
      phone,
    },
  });

  console.log("Generated registration ID:", registrationId);
  console.log("Registration created:", registration);
  
  if (registration) {
    res.status(201).json({
      _id: registration._id,
      registrationId: registration.registrationId,
      eventName: registration.eventDetails.eventName,
      status: registration.status,
    });
  } else {
    res.status(400);
    throw new Error('Invalid registration data');
  }
});

// @desc    Get user registrations
// @route   GET /api/registrations
// @access  Private
const getUserRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .sort({ createdAt: -1 });
  
  res.json(registrations);
});

// @desc    Get a specific registration
// @route   GET /api/registrations/:id
// @access  Private
const getRegistrationById = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);
  
  if (registration && registration.user.toString() === req.user._id.toString()) {
    res.json(registration);
  } else {
    res.status(404);
    throw new Error('Registration not found');
  }
});

// @desc    Cancel a registration
// @route   PUT /api/registrations/:id/cancel
// @access  Private
const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);
  
  if (!registration) {
    res.status(404);
    throw new Error('Registration not found');
  }
  
  // Check if user is authorized to cancel this registration
  if (registration.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to cancel this registration');
  }
  
  // Check if registration can be cancelled (e.g., not too close to event date)
  const event = await Event.findById(registration.event);
  
  // Update registration status
  registration.status = 'cancelled';
  await registration.save();
  
  res.json({
    message: 'Registration cancelled successfully',
    registration,
  });
});

// @desc    Get all registrations (admin only)
// @route   GET /api/registrations/admin
// @access  Private/Admin
const getAllRegistrations = asyncHandler(async (req, res) => {
  // Check if admin has access to the event category
  const adminDepartment = req.admin.department.toLowerCase();
  
  let filter = {};
  
  if (adminDepartment === 'culturals' || adminDepartment === 'cultural') {
    filter = { 'eventDetails.eventCategory': { $regex: /cultural/i } };
  } else if (adminDepartment === 'sports') {
    filter = { 'eventDetails.eventCategory': { $regex: /sports/i } };
  }
  
  const registrations = await Registration.find(filter)
    .sort({ createdAt: -1 });
  
  res.json(registrations);
});

// @desc    Get registrations by event
// @route   GET /api/registrations/event/:eventId
// @access  Private/Admin
const getRegistrationsByEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  
  // Check if admin has access to this event category
  const adminDepartment = req.admin.department.toLowerCase();
  const eventCategory = event.eventCategory.toLowerCase();
  
  if ((adminDepartment === 'culturals' && eventCategory !== 'cultural') ||
      (adminDepartment === 'sports' && eventCategory !== 'sports')) {
    res.status(401);
    throw new Error('Not authorized to access these registrations');
  }
  
  const registrations = await Registration.find({ event: req.params.eventId })
    .sort({ createdAt: -1 });
  
  res.json(registrations);
});

module.exports = {
  registerForEvent,
  getUserRegistrations,
  getRegistrationById,
  cancelRegistration,
  getAllRegistrations,
  getRegistrationsByEvent,
};