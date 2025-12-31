const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

const isProd = process.env.NODE_ENV === 'production';

const logger = {
    info: (message, meta = {}) => {
        if (isProd) {
            console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
        } else {
            console.log(`${colors.blue}[INFO]${colors.reset} ${message}`, meta);
        }
    },

    error: (message, error = {}) => {
        if (isProd) {
            console.error(JSON.stringify({
                level: 'error',
                message,
                error: error.message || error,
                timestamp: new Date().toISOString()
            }));
        } else {
            console.error(`${colors.red}[ERROR]${colors.reset} ${message}`, error);
        }
    },

    warn: (message, meta = {}) => {
        if (isProd) {
            console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }));
        } else {
            console.warn(`${colors.yellow}[WARN]${colors.reset} ${message}`, meta);
        }
    },

    success: (message, meta = {}) => {
        if (isProd) {
            console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
        } else {
            console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`, meta);
        }
    },
};

module.exports = logger;
