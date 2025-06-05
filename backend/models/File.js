const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  filetype: String,
  lastModified: String,
  fileId: mongoose.Schema.Types.ObjectId,
  category: String,
  fileNumber: String,  // Store the file number here
  zone: String,        // New: Zone field
  branch: String,      // New: Branch field
});

const File = mongoose.model('File', fileSchema);

module.exports = File; 