const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        time: {
            type: String,
            required: [true, 'Time is required'],
            validate: {
                validator: function (v) {
                    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
                },
                message: 'Time must be in HH:MM format (24-hour)',
            },
        },
        isBooked: {
            type: Boolean,
            default: false,
        },
        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for fast lookups and uniqueness
timeSlotSchema.index({ date: 1, time: 1 }, { unique: true });

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
