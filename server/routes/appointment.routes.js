const express = require('express');
const {
    createAppointment,
    getAllAppointments,
    updateAppointmentStatus,
} = require('../controllers/appointment.controllers');
const { authenticateAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/appointments - Create new appointment (public)
router.post('/', createAppointment);

// GET /api/appointments - Get all appointments (admin only)
router.get('/', authenticateAdmin, getAllAppointments);

// PATCH /api/appointments/:id/status - Update appointment status (admin only)
router.patch('/:id/status', authenticateAdmin, updateAppointmentStatus);

module.exports = router;
