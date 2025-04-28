// models/registrationModel.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    registrationId: {
      type: String,
      required: true,
      unique: true,
    },
    eventDetails: {
      eventName: String,
      eventCategory: String,
      subCategory: String,
    },
    userDetails: {
      userId: String, // MHID
      name: String,
      phone: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;