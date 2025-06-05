const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['success', 'error', 'warning', 'info', 'default'],
    default: 'default'
  },
  category: {
    type: String,
    enum: ['announcement', 'task', 'ticket', 'user', 'file', 'system'],
    required: true
  },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  relatedId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  zone: { type: String },
  branch: { type: String },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for faster queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 