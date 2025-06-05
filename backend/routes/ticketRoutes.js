const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Create a new ticket
router.post('/', ticketController.createTicket);

// Get all tickets
router.get('/', ticketController.getAllTickets);

// Get a ticket by ID
router.get('/:ticketId', ticketController.getTicketById);

// Update ticket status
router.put('/:ticketId/status', ticketController.updateTicketStatus);

// Delete a ticket
router.delete('/:ticketId', ticketController.deleteTicket);

module.exports = router; 