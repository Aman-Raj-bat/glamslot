const Appointment = require('../models/appointment');
const TimeSlot = require('../models/timeSlot');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res) => {
    try {
        const { name, phone, date, time } = req.body;

        // Step 1: Parse date to match stored format
        const requestedDate = new Date(date);
        const nextDay = new Date(requestedDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Step 2: Find matching time slot
        const timeSlot = await TimeSlot.findOne({
            date: {
                $gte: requestedDate,
                $lt: nextDay,
            },
            time: time,
        });

        if (!timeSlot) {
            return res.status(400).json({
                success: false,
                error: 'Time slot not available. Please check available slots first.',
            });
        }

        // Step 3: Check if slot is already booked
        if (timeSlot.isBooked) {
            return res.status(409).json({
                success: false,
                error: 'Time slot is already booked. Please choose another time.',
            });
        }

        // Step 4: Create appointment
        const appointment = await Appointment.create({
            name,
            phone,
            date,
            time,
            timeSlot: timeSlot._id,
        });

        // Step 5: Mark slot as booked (atomic update)
        await TimeSlot.findByIdAndUpdate(timeSlot._id, {
            isBooked: true,
            bookedBy: appointment._id,
        });

        res.status(201).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                error: messages,
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Admin
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ date: -1, time: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Admin
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'approved', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Status must be pending, approved, or cancelled',
            });
        }

        // Find appointment before updating
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found',
            });
        }

        // If cancelling, release the time slot
        if (status === 'cancelled' && appointment.timeSlot) {
            await TimeSlot.findByIdAndUpdate(appointment.timeSlot, {
                isBooked: false,
                bookedBy: null,
            });
        }

        // Update appointment status
        appointment.status = status;
        await appointment.save();

        res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};

module.exports = {
    createAppointment,
    getAllAppointments,
    updateAppointmentStatus,
};