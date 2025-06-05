const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  zoneName: { type: String, required: true }, // The name of the zone
  branches: { type: [String], default: [] },  // List of branches in this zone
});

const Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone; 