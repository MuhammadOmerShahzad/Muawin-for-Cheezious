const express = require('express');
const router = express.Router();
const assignedTaskController = require('../controllers/assignedTaskController');

// Mark an assigned task as completed
router.put('/:taskId/complete', assignedTaskController.completeAssignedTask);

// Get assigned tasks with filters
router.get('/', assignedTaskController.getAssignedTasks);

// Add a new assigned task
router.post('/', assignedTaskController.addAssignedTask);

module.exports = router; 