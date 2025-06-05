const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');

// Initialize zones
router.post('/initialize', zoneController.initializeZones);

// Get all zones
router.get('/', zoneController.getAllZones);

// Get branches by zone
router.get('/:zoneName/branches', zoneController.getBranchesByZone);

// Add branch to zone
router.post('/:zoneName/branches', zoneController.addBranchToZone);

// Update branch in zone
router.put('/:zoneName/branches', zoneController.updateBranchInZone);

// Delete branch from zone
router.delete('/:zoneName/branches', zoneController.deleteBranchFromZone);

module.exports = router; 