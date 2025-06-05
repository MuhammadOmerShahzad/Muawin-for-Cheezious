const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Get files by category
router.get('/:category/:zone/:branch', fileController.getFilesByCategory);

// Upload a file
router.post('/:category/:zone/:branch', fileController.upload.single('file'), fileController.uploadFile);

// Download a file
router.get('/download/:filename', fileController.downloadFile);

// Delete a file
router.delete('/:category/:zone/:branch/:filename', fileController.deleteFile);

module.exports = router; 