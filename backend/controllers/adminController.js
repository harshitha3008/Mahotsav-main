// File: controllers/adminController.js
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, adminId, role) => {
  return jwt.sign(
    { id, adminId, role }, // Added adminId and role to the payload
    process.env.JWT_SECRET || 'your_jwt_secret',
    {
      expiresIn: '30d',
    }
  );
};


// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
exports.registerAdmin = async (req, res) => {
  try {
    const { adminId, password, role } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ adminId });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    const admin = await Admin.create({
      adminId,
      password,
      role
    });
    
    if (admin) {
      res.status(201).json({
        _id: admin._id,
        adminId: admin.adminId,
        role: admin.role,
        token: generateToken(admin._id, admin.adminId, admin.role) // Updated to pass adminId and role
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error('Error in registerAdmin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { adminId, password, role } = req.body;
    
    console.log(`Login attempt - adminId: ${adminId}, role: ${role}`);

    // Find admin by adminId
    const admin = await Admin.findOne({ adminId });

    if (!admin) {
      console.log('Admin not found');
      return res.status(401).json({ message: 'Invalid admin ID or password' });
    }

    console.log(`Found admin with role: ${admin.role}`);

    // Check if password matches
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid admin ID or password' });
    }

    // Check if the role from request matches the admin's role in database
    if (role !== admin.role) {
      console.log(`Role mismatch: Requested ${role}, but admin is ${admin.role}`);
      return res.status(401).json({ message: 'Invalid role selected' });
    }

    // Generate token and return appropriate response based on role
    const token = generateToken(admin._id, admin.adminId, admin.role);
    
    if (admin.role === 'core') {
      console.log('Login successful for core admin');
      res.json({
        _id: admin._id,
        adminId: admin.adminId,
        role: admin.role,
        token: token,
        accessLevel: 'full'
      });
    } else if (admin.role === 'lead') {
      console.log('Login successful for lead admin');
      res.json({
        _id: admin._id,
        adminId: admin.adminId,
        role: admin.role,
        token: token,
        accessLevel: 'lead'
      });
    } else {
      // Handle any other roles (though we shouldn't get here based on role validation)
      console.log(`Login successful for ${admin.role} admin`);
      res.json({
        _id: admin._id,
        adminId: admin.adminId,
        role: admin.role,
        token: token,
        accessLevel: 'limited'
      });
    }
  } catch (error) {
    console.error('Error in loginAdmin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    console.error('Error in getAdminProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add this to your adminController.js
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const admin = await Admin.findById(id)
      .select('adminId role -_id')  // Only return necessary fields, exclude password
      .lean();
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    res.status(200).json(admin);
  } catch (error) {
    console.error('Error fetching admin by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin',
      error: error.message
    });
  }
};