const TimeSlot = require('../models/timeSlot');

// @desc    Create time slots (bulk)
// @route   POST /api/slots
// @access  Admin
const createTimeSlots = async (req, res) => {
    try {
        const { slots } = req.body;

        if (!Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Slots must be a non-empty array',
            });
        }

        // Validate each slot has date and time
        for (const slot of slots) {
            if (!slot.date || !slot.time) {
                return res.status(400).json({
                    success: false,
                    error: 'Each slot must have date and time',
                });
            }
        }

        // Attempt to create slots (duplicates will be caught by unique index)
        const createdSlots = [];
        const errors = [];

        for (const slot of slots) {
            try {
                const newSlot = await TimeSlot.create({
                    date: slot.date,
                    time: slot.time,
                });
                createdSlots.push(newSlot);
            } catch (error) {
                if (error.code === 11000) {
                    errors.push(`Slot already exists for ${slot.date} at ${slot.time}`);
                } else {
                    errors.push(`Error creating slot: ${error.message}`);
                }
            }
        }

        res.status(201).json({
            success: true,
            created: createdSlots.length,
            data: createdSlots,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};

// @desc    Get available time slots for a specific date
// @route   GET /api/slots/available?date=YYYY-MM-DD
// @access  Public
// @desc    Get available time slots for a specific date
// @route   GET /api/slots/available?date=YYYY-MM-DD
// @access  Public
const getAvailableSlots = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                error: 'Date query parameter is required (format: YYYY-MM-DD)',
            });
        }

        // Parse date to match stored format (UTC midnight for the date string)
        const requestedDate = new Date(date);
        const nextDay = new Date(requestedDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Check if ANY slots exist for this date (booked or unbooked)
        const existingCount = await TimeSlot.countDocuments({
            date: {
                $gte: requestedDate,
                $lt: nextDay,
            },
        });

        // DEMO MODE: If no slots exist for this date, seed them automatically
        if (existingCount === 0) {
            const DEMO_TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
            const demoSlots = DEMO_TIMES.map(time => ({
                date: requestedDate,
                time: time,
                isBooked: false
            }));

            try {
                await TimeSlot.insertMany(demoSlots);
                console.log(`Seeded demo slots for ${date}`);
            } catch (seedError) {
                console.error("Error seeding demo slots:", seedError);
                // Continue to fetch whatever is there, or handle error
            }
        }

        const availableSlots = await TimeSlot.find({
            date: {
                $gte: requestedDate,
                $lt: nextDay,
            },
            isBooked: false,
        }).sort({ time: 1 });

        res.status(200).json({
            success: true,
            count: availableSlots.length,
            data: availableSlots,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};

// @desc    Get all time slots (with optional date filter)
// @route   GET /api/slots?date=YYYY-MM-DD (optional)
// @access  Admin
const getAllSlots = async (req, res) => {
    try {
        const { date } = req.query;
        let query = {};

        if (date) {
            const requestedDate = new Date(date);
            const nextDay = new Date(requestedDate);
            nextDay.setDate(nextDay.getDate() + 1);

            query.date = {
                $gte: requestedDate,
                $lt: nextDay,
            };
        }

        const slots = await TimeSlot.find(query)
            .populate('bookedBy', 'name phone')
            .sort({ date: 1, time: 1 });

        res.status(200).json({
            success: true,
            count: slots.length,
            data: slots,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};

// @desc    Delete a time slot
// @route   DELETE /api/slots/:id
// @access  Admin
const deleteTimeSlot = async (req, res) => {
    try {
        const slot = await TimeSlot.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({
                success: false,
                error: 'Time slot not found',
            });
        }

        if (slot.isBooked) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete a booked time slot',
            });
        }

        await TimeSlot.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Time slot deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};

module.exports = {
    createTimeSlots,
    getAvailableSlots,
    getAllSlots,
    deleteTimeSlot,
};
