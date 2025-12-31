const express = require('express');
const { adminLogin } = require('../controllers/auth.controllers');

const router = express.Router();

// POST /api/auth/login - Admin login
router.post('/login', adminLogin);

module.exports = router;
