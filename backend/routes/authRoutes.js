const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Sign in route
router.post('/signin', userController.signInUser);

module.exports = router; 