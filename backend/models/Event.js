const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  }
});

const contactPersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      // First contact person is required
      return this === this.parent[0];
    }
  },
  phone: {
    type: String,
    required: function() {
      // First contact person is required
      return this === this.parent[0];
    }
  }
});

const eventSchema = new mongoose.Schema({
  eventCategory: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  participantCategory: {
    type: String,
    enum: ['men', 'women', 'men & women', 'no category'],
    required: true
  },
  imageUrl: {
    type: String
  },
  rules: {
    type: String,
    required: true
  },
  prizes: {
    men: [prizeSchema],
    women: [prizeSchema],
    'no category': [prizeSchema]
  },
  leadAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  adminId: {
    type: String,  // Or mongoose.Schema.Types.ObjectId if you prefer
    required: false
  },
  contactPersons: [contactPersonSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;