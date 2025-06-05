const mongoose = require('mongoose');

const assignedTaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  date: { type: String, required: true },
  deadline: { type: Date, required: true },
  zone: { type: String, required: true },
  branch: { type: String, required: true },
  completedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }, // Array of user IDs who completed the task
  completed: { type: Boolean, default: false }, // Completion status for the task
});

const AssignedTask = mongoose.model('AssignedTask', assignedTaskSchema);

module.exports = AssignedTask; 