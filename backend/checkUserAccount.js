require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const user = await User.findOne({ email: 'vermakrishansh@gmail.com' }).select('+password');
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }
    
    console.log('✅ User found:');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.name);
    console.log('🏷️  UserType:', user.userType);
    console.log('✓ IsActive:', user.isActive);
    console.log('🆔 ID:', user._id);
    console.log('🔒 Has password:', user.password ? 'Yes' : 'No');
    
    // Test password
    if (user.password) {
      const match = await user.comparePassword('consumer123');
      console.log('🔑 Password matches "consumer123":', match);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUser();
