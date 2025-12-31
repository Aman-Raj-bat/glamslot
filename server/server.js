require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const appointmentRoutes = require('./routes/appointment.routes');
const timeSlotRoutes = require('./routes/timeSlot.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const validateEnv = require('./utils/validateEnv');
const logger = require('./utils/logger');

// Validate environment variables
validateEnv();

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/slots', timeSlotRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        database: dbStatus,
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'GlamSlot API is running',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
    });
});

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Start server function
const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Start Express server
        const PORT = process.env.PORT || 5000;
        const server = app.listen(PORT, () => {
            logger.success('Server started successfully', {
                port: PORT,
                environment: process.env.NODE_ENV,
            });
        });

        // Graceful shutdown handler
        const gracefulShutdown = () => {
            logger.info('SIGTERM received, shutting down gracefully...');
            server.close(() => {
                logger.info('HTTP server closed');
                mongoose.connection.close(false, () => {
                    logger.info('MongoDB connection closed');
                    process.exit(0);
                });
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', reason);
    process.exit(1);
});

// Start the server
startServer();
