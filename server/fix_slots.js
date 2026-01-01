require('dotenv').config();
const mongoose = require('mongoose');
const TimeSlot = require('./models/timeSlot');
const connectDB = require('./config/db');

const fixSlots = async () => {
    try {
        await connectDB();

        console.log('Clearing existing slots...');
        await TimeSlot.deleteMany({});

        console.log('Seeding new slots with UTC Midnight dates...');

        // Use the string format 'YYYY-MM-DD' to ensure UTC Midnight when passed to new Date()
        // This Date string MUST match what the frontend sends defaults 'YYYY-MM-DD'
        // Frontend uses: new Date().toISOString().split('T')[0] which is '2026-01-01' (given current time)
        const dateString = '2026-01-01';
        const dateObj = new Date(dateString); // "2026-01-01T00:00:00.000Z"

        const slots = [
            { time: "10:00" },
            { time: "11:00" },
            { time: "12:00" },
            { time: "13:00" },
            { time: "14:00" },
            { time: "15:00" },
            { time: "16:00" }
        ];

        let createdCount = 0;

        for (const slot of slots) {
            await TimeSlot.create({
                date: dateObj,
                time: slot.time,
                isBooked: false
            });
            createdCount++;
        }

        console.log(`✅ Successfully re-seeded ${createdCount} slots for date: ${dateString} (Stored as: ${dateObj.toISOString()})`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Usage Error:', error);
        process.exit(1);
    }
};

fixSlots();
