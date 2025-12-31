const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: 'Phone number must be exactly 10 digits',
            },
        },
        date: {
            type: Date,
            required: [true, 'Appointment date is required'],
        },
        time: {
            type: String,
            required: [true, 'Appointment time is required'],
            validate: {
                validator: function (v) {
                    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
                },
                message: 'Time must be in HH:MM format (24-hour)',
            },
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'approved', 'cancelled'],
                message: 'Status must be pending, approved, or cancelled',
            },
            default: 'pending',
        },
        timeSlot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TimeSlot',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
