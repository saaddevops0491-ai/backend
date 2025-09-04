const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@saherflow.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@saherflow.com',
      company: 'Saher Flow Solutions',
      password: 'Admin123',
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@saherflow.com');
    console.log('🔑 Password: Admin123');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

module.exports = createAdminUser;