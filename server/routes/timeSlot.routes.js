const express = require('express');
const {
    createTimeSlots,
    getAvailableSlots,
    getAllSlots,
    deleteTimeSlot,
} = require('../controllers/timeSlot.controllers');
const { authenticateAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/slots/available - Get available slots for a date (public)
router.get('/available', getAvailableSlots);

// POST /api/slots - Create time slots (admin only)
router.post('/', authenticateAdmin, createTimeSlots);

// GET /api/slots - Get all slots with optional date filter (admin only)
router.get('/', authenticateAdmin, getAllSlots);

// DELETE /api/slots/:id - Delete a time slot (admin only)
router.delete('/:id', authenticateAdmin, deleteTimeSlot);

module.exports = router;
