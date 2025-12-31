const logger = require('./logger');

const validateEnv = () => {
    logger.info('Validating environment variables...');

    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
    const missingVars = [];

    // Check required variables
    requiredEnvVars.forEach((varName) => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });

    if (missingVars.length > 0) {
        logger.error('Missing required environment variables', { missing: missingVars });
        logger.error('Server cannot start without these variables. Please check your .env file.');
        process.exit(1);
    }

    // Set defaults for optional variables
    if (!process.env.PORT) {
        process.env.PORT = '5000';
        logger.warn('PORT not set, using default: 5000');
    }

    if (!process.env.NODE_ENV) {
        process.env.NODE_ENV = 'development';
        logger.warn('NODE_ENV not set, using default: development');
    }

    // Warn if ALLOWED_ORIGINS not set in production
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOWED_ORIGINS) {
        logger.warn('ALLOWED_ORIGINS not set in production. CORS will allow all origins (*)');
        logger.warn('Consider setting ALLOWED_ORIGINS for better security');
    }

    // Log validated configuration (mask secrets)
    logger.success('Environment variables validated successfully');
    logger.info('Configuration', {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        MONGO_URI: maskSecret(process.env.MONGO_URI),
        JWT_SECRET: maskSecret(process.env.JWT_SECRET),
        ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || '*',
    });
};

// Helper to mask secrets in logs
const maskSecret = (secret) => {
    if (!secret) return 'NOT_SET';
    if (secret.length <= 8) return '****';
    return `${secret.substring(0, 4)}...${secret.substring(secret.length - 4)}`;
};

module.exports = validateEnv;
