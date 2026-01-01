require('dotenv').config();
const mongoose = require('mongoose');
const TimeSlot = require('./models/timeSlot');
const connectDB = require('./config/db');

const checkSlots = async () => {
    try {
        await connectDB();

        console.log('Connected. Fetching all slots...');
        const slots = await TimeSlot.find({});

        console.log(`Found ${slots.length} slots.`);
        slots.forEach(s => {
            console.log(`ID: ${s._id}, Date: ${s.date.toISOString()}, Time: ${s.time}, LocalToString: ${s.date.toString()}`);
        });

        // Test the query that the controller uses
        const queryDateString = '2026-01-01'; // Assuming this is what frontend sends
        const requestedDate = new Date(queryDateString);
        const nextDay = new Date(requestedDate);
        nextDay.setDate(nextDay.getDate() + 1);

        console.log(`\nTesting Query for date: ${queryDateString}`);
        console.log(`Query Range: ${requestedDate.toISOString()} to ${nextDay.toISOString()}`);

        const found = await TimeSlot.find({
            date: {
                $gte: requestedDate,
                $lt: nextDay,
            }
        });
        console.log(`Query found ${found.length} slots.`);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkSlots();
