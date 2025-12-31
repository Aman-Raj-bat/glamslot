// 404 handler for unknown routes
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
};

module.exports = notFound;
