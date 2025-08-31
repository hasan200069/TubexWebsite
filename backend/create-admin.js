// Quick script to create an admin user
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tubex');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@tubex.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('Email: admin@tubex.com');
      console.log('Password: Admin123');
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@tubex.com',
      password: 'Admin123', // Will be hashed automatically
      role: 'admin',
      company: 'TubeX IT Services',
      emailVerified: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('Email: admin@tubex.com');
    console.log('Password: Admin123');
    console.log('Role: admin');
    console.log('');
    console.log('🚀 You can now login to the admin panel!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
