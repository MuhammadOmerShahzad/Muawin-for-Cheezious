const express = require('express');
const router = express.Router();
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');
const { auth } = require('../middleware/auth');

// Get user's notifications
router.get('/', auth, (req, res) => getUserNotifications(req, res));

// Mark notifications as read
router.post('/mark-read', auth, (req, res) => markAsRead(req, res));

module.exports = router; 