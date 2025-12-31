const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// Middleware to authenticate admin using JWT
const authenticateAdmin = async (req, res, next) => {
    try {
        // Step 1: Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided',
            });
        }

        const token = authHeader.split(' ')[1];

        // Step 2: Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token',
            });
        }

        // Step 3: Find admin by ID from token
        const admin = await Admin.findById(decoded.id).select('-password');

        if (!admin) {
            return res.status(401).json({
                success: false,
                error: 'Admin not found',
            });
        }

        // Step 4: Attach admin to request
        req.admin = admin;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
};

module.exports = { authenticateAdmin };
