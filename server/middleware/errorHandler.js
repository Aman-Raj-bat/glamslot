const logger = require('../utils/logger');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    logger.error('Error caught by global handler', {
        message: err.message,
        path: req.path,
        method: req.method,
    });

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server error';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const messages = Object.values(err.errors).map((e) => e.message);
        message = messages.join(', ');
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyPattern)[0];
        message = `Duplicate value for ${field}`;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Prepare error response
    const errorResponse = {
        success: false,
        error: message,
    };

    // Include stack trace only in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
