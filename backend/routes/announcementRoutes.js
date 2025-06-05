const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { auth } = require('../middleware/auth');

// Add a new announcement
router.post('/', auth, announcementController.addAnnouncement);

// Get all announcements
router.get('/', auth, announcementController.getAllAnnouncements);

// Get the latest announcement
router.get('/latest', auth, announcementController.getLatestAnnouncement);

module.exports = router; 