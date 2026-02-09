const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  
  // Reset both account passwords
  const farmer = await User.findOne({ email: 'vermaashwani@hotmail.com' }).select('+password');
  const consumer = await User.findOne({ email: 'vermakrishansh@gmail.com' }).select('+password');
  
  if (farmer) {
    // Set password directly - the pre-save hook will hash it
    farmer.password = 'farmer123';
    await farmer.save();
    console.log('✅ Farmer password reset to: farmer123');
  } else {
    console.log('❌ Farmer account not found');
  }
  
  if (consumer) {
    // Set password directly - the pre-save hook will hash it
    consumer.password = 'consumer123';
    await consumer.save();
    console.log('✅ Consumer password reset to: consumer123');
  } else {
    console.log('❌ Consumer account not found');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
