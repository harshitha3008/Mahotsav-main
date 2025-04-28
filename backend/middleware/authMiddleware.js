const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin'); // Add this import

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

      // Check if we have a user ID or admin ID
      if (decoded.id) {
        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
          // Try to find an admin instead
          req.admin = await Admin.findById(decoded.id);
          
          if (!req.admin) {
            return res.status(401).json({ message: 'Not authorized, user/admin not found' });
          }
        }
      } else {
        return res.status(401).json({ message: 'Invalid token structure' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;