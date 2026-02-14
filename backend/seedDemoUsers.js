require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const demoUsers = [
  {
    name: 'Demo Consumer',
    email: 'consumer@demo.com',
    password: 'demo123',
    userType: 'consumer',
    phone: '1234567890'
  },
  {
    name: 'Demo Farmer',
    email: 'farmer@demo.com',
    password: 'demo123',
    userType: 'farmer',
    phone: '1234567891',
    farmDetails: {
      farmName: 'Demo Farm',
      farmSize: '10 acres',
      location: 'Demo Location'
    }
  },
  {
    name: 'Demo Admin',
    email: 'admin@demo.com',
    password: 'demo123',
    userType: 'admin',
    phone: '1234567892'
  }
];

async function createDemoUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    for (const userData of demoUsers) {
      // Delete existing user if exists
      await User.deleteOne({ email: userData.email });
      console.log(`🗑️  Deleted existing user if any: ${userData.email}`);

      // Create user (do NOT pre-hash password, let the pre-save hook handle it)
      const userDataForCreate = { ...userData };
      // Password will be hashed by the pre-save hook in User model
      
      const user = await User.create(userDataForCreate);
      console.log(`✅ Created ${user.userType}: ${user.email}`);
    }

    console.log('\n✨ Demo users created successfully!');
    console.log('\nYou can now login with:');
    console.log('- consumer@demo.com / demo123');
    console.log('- farmer@demo.com / demo123');
    console.log('- admin@demo.com / demo123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDemoUsers();
