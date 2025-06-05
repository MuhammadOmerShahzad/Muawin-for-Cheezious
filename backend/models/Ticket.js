const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true }, // Unique 5-digit ticket ID
  subject: { type: String, required: true }, // Ticket subject
  description: { type: String, required: true }, // Ticket description
  status: { type: String, default: 'Open' }, // Status: Open, In Progress, Closed
  createdBy: { type: String, required: true }, // User who created the ticket
  createdAt: { type: Date, default: Date.now }, // Creation date
  updatedAt: { type: Date, default: Date.now }, // Last updated date
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket; 