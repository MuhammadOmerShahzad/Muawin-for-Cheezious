const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  announcement: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement; 