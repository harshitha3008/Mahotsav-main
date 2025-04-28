const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate MHID
userSchema.pre('save', async function(next) {
  if (this.mhid) {
    return next();
  }
  
  try {
    // Find the highest current MHID number
    const highestUser = await this.constructor.findOne({}, {}, { sort: { 'mhid': -1 } });
    
    let nextNumber = 1;
    if (highestUser && highestUser.mhid) {
      // Extract the number part from the existing highest MHID
      const currentNumber = parseInt(highestUser.mhid.replace('MH26', ''));
      nextNumber = isNaN(currentNumber) ? 1 : currentNumber + 1;
    }
    
    // Set the new MHID
    this.mhid = `MH26${nextNumber}`;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;