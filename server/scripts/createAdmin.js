/**
 * One-time script to create an admin account
 * Usage: node scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/admin');

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@glamslot.com' });

        if (existingAdmin) {
            console.log('Admin already exists!');
            console.log('Email:', existingAdmin.email);
            process.exit(0);
        }

        // Create new admin
        const admin = await Admin.create({
            email: 'admin@glamslot.com',
            password: 'Admin@123', // Change this to a secure password
        });

        console.log('\n✅ Admin account created successfully!');
        console.log('Email:', admin.email);
        console.log('Password: Admin@123');
        console.log('\n⚠️  Please change the password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
