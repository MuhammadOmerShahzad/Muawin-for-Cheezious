const mongoose = require('mongoose');

const cylinderExpirySchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  categories: [{
    category: {
      type: String,
      required: true
    },
    weight: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }],
  zone: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CylinderExpiry', cylinderExpirySchema); 