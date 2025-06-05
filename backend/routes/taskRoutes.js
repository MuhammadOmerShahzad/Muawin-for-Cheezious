const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Add a new task
router.post('/', taskController.addTask);

// Get all tasks (with optional zone and branch filters)
router.get('/', taskController.getAllTasks);

// Get a task by ID
router.get('/:id', taskController.getTaskById);

// Update a task
router.put('/:id', taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router; 