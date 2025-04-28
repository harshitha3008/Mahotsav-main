const mongoose = require('mongoose');
const bcryptjs = require('bcryptjsjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  college: {
    type: String,
    required: [true, 'College name is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  mhid: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcryptjs
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Get the next available MHID with a specific number
const getNextAvailableMhid = async (model, baseNumber) => {
  let currentNumber = baseNumber;
  let mhid;
  let exists = true;
  
  // Try incremental numbers until we find one that doesn't exist
  while (exists) {
    mhid = `MH26${currentNumber}`;
    // Check if this MHID exists
    const existingUser = await model.findOne({ mhid });
    if (!existingUser) {
      exists = false; // We found a non-existent MHID
    } else {
      currentNumber++; // Try the next number
    }
  }
  
  return mhid;
};

// Generate MHID with a more robust approach
userSchema.pre('save', async function(next) {
  if (this.mhid) {
    return next();
  }
  
  try {
    // Find the highest current MHID number as a starting point
    const highestUser = await this.constructor.findOne({}, {}, { sort: { 'mhid': -1 } });
    
    let baseNumber = 1;
    if (highestUser && highestUser.mhid) {
      // Extract the number part from the existing highest MHID
      const currentNumberStr = highestUser.mhid.replace('MH26', '');
      const currentNumber = parseInt(currentNumberStr);
      baseNumber = isNaN(currentNumber) ? 1 : currentNumber + 1;
    }
    
    // Get the next available MHID that doesn't exist in the database
    this.mhid = await getNextAvailableMhid(this.constructor, baseNumber);
    
    // In the unlikely case we still can't generate a unique ID,
    // add a random suffix to ensure uniqueness
    if (!this.mhid) {
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      this.mhid = `MH26${random}`;
    }
    
    next();
  } catch (error) {
    console.error('Error generating MHID:', error);
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;