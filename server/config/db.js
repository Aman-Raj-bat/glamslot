const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });
        logger.success('MongoDB connected', { host: conn.connection.host });
        return conn;
    } catch (error) {
        logger.error('MongoDB connection failed', error);
        throw error; // Throw to be caught by server.js
    }
};

module.exports = connectDB;
