// Script to create the first admin user
// Run: npm run create-admin
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL || 'admin@company.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists with email:', email);
      process.exit(0);
    }

    await Admin.create({ email, password });
    console.log('Admin created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Please change the password after first login in production.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
