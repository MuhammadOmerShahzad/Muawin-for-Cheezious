const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  date: { type: String, required: true },
  deadline: { type: Date, required: true },
  zone: { type: String, required: true },
  branch: { type: String, required: true },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 