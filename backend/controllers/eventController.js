const Event = require('../models/Event');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

exports.createEvent = async (req, res) => {
  try {
    const {
      eventCategory,
      eventName,
      participantCategory,
      rules
    } = req.body;
    
    // Parse JSON strings from FormData
    const prizes = JSON.parse(req.body.prizes);
    const leadAuth = JSON.parse(req.body.leadAuth);
    const contactPersons = JSON.parse(req.body.contactPersons);

    // First, find or create the admin
    let admin = await Admin.findOne({ adminId: leadAuth.id });
    
    if (!admin) {
      // If the admin doesn't exist, create a new one with role 'lead'
      admin = new Admin({
        adminId: leadAuth.id,
        password: leadAuth.password, // Pre-save hook will hash this if needed
        role: 'lead' // Always set role to 'lead' as specified
      });
      
      await admin.save();
    } else {
      // If admin exists, verify password
      const isPasswordValid = await bcrypt.compare(leadAuth.password, admin.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials'
        });
      }
    }

    // Handle image upload if provided
    let imageUrl = null;
    if (req.file) {
      // In a production app, you'd upload to cloud storage
      // For this example, we'll just use the file path
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Extract admin ID from token if it exists (not role anymore)
    // Extract adminId from token if it exists (not id anymore)
    // In eventController.js createEvent function
let adminId = null;

if (req.headers.authorization) {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Try to get adminId directly from the token
    if (decoded.adminId) {
      adminId = decoded.adminId;
    } 
    // If not found, try to look up the Admin to get the adminId
    else if (decoded.id) {
      const admin = await Admin.findById(decoded.id);
      if (admin) {
        adminId = admin.adminId;
        console.log('Retrieved adminId from database:', adminId);
      }
    }
  } catch (error) {
    console.error('Error processing token:', error);
  }
}

    // Create new event and reference the admin
    const newEvent = new Event({
      eventCategory,
      eventName,
      participantCategory,
      imageUrl,
      rules,
      prizes,
      leadAdmin: admin._id,
      adminId: adminId, // Store adminId instead of adminRole
      contactPersons: contactPersons.filter(contact => contact.name || contact.phone)
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      eventId: newEvent._id
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};
// Add this new function to get events by role
exports.getEventsByAdmin = async (req, res) => {
  try {
    // Get the adminId from the JWT token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Extract adminId from the token (this should be the string value like "sports")
    const adminId = decoded.adminId;
    
    // Simply filter by adminId without checking role
    const filter = { adminId: adminId };
    
    console.log('Filtering events by:', filter); // For debugging
    
    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();
    
    res.status(200).json({
      success: true,
      events: events
    });
  } catch (error) {
    console.error('Error fetching events by admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

// Add this function to your eventController.js

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id)
      .select('-__v')
      .lean();
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the event to update
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Get the adminId from the JWT token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.adminId;
    
    // Check if the user has permission to update this event
    // Either the user is the lead admin of this event or has the same adminId
    if (event.adminId !== adminId && event.leadAdmin.toString() !== decoded.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this event'
      });
    }
    
    // Parse data from request
    let updateData = {};
    
    if (req.file) {
      // Handle new image upload
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      // Handle form data
      updateData = {
        ...updateData,
        eventCategory: req.body.eventCategory,
        eventName: req.body.eventName,
        participantCategory: req.body.participantCategory,
        rules: req.body.rules,
        prizes: JSON.parse(req.body.prizes),
        contactPersons: JSON.parse(req.body.contactPersons)
      };
      
      // Handle lead auth if provided
      if (req.body.leadAuth) {
        const leadAuth = JSON.parse(req.body.leadAuth);
        
        // Only update password if a new one is provided
        if (leadAuth.password && leadAuth.password.trim() !== '') {
          // Update the lead admin's password
          const leadAdmin = await Admin.findById(event.leadAdmin);
          if (leadAdmin) {
            leadAdmin.password = leadAuth.password; // The pre-save hook will hash it
            await leadAdmin.save();
          }
        }
      }
    } else {
      // Handle JSON data
      const { eventCategory, eventName, participantCategory, rules, prizes, contactPersons, leadAuth } = req.body;
      
      updateData = {
        ...updateData,
        eventCategory,
        eventName,
        participantCategory,
        rules,
        prizes,
        contactPersons
      };
      
      // Handle lead auth if provided
      if (leadAuth && leadAuth.password && leadAuth.password.trim() !== '') {
        // Update the lead admin's password
        const leadAdmin = await Admin.findById(event.leadAdmin);
        if (leadAdmin) {
          leadAdmin.password = leadAuth.password; // The pre-save hook will hash it
          await leadAdmin.save();
        }
      }
    }
    
    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the event to delete
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Get the adminId from the JWT token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.adminId;
    
    // Check if the user has permission to delete this event
    // Either the user is the lead admin of this event or has the same adminId
    if (event.adminId !== adminId && event.leadAdmin.toString() !== decoded.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this event'
      });
    }
    
    // Delete the event image if it exists
    if (event.imageUrl) {
      const imagePath = path.join(__dirname, '..', event.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete the event
    await Event.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};