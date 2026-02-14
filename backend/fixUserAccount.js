require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Delete existing user
    await User.deleteOne({ email: 'vermakrishansh@gmail.com' });
    console.log('🗑️  Deleted existing user if any');
    
    // Create fresh user
    const user = await User.create({
      name: 'Krishansh Verma',
      email: 'vermakrishansh@gmail.com',
      password: 'consumer123',  // Will be hashed by pre-save hook
      userType: 'consumer',
      phoneNumber: '1234567890'
    });
    
    console.log(`✅ Created user: ${user.email}`);
    console.log(`🆔 User ID: ${user._id}`);
    console.log('\n✨ You can now login with:');
    console.log('Email: vermakrishansh@gmail.com');
    console.log('Password: consumer123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixUser();
