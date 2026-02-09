const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const farmer = await User.findOne({ email: 'vermaashwani@hotmail.com' }).select('+password');
  console.log('Farmer found:', !!farmer);
  console.log('Has password:', !!farmer?.password);
  console.log('Password starts with $2:', farmer?.password?.startsWith('$2'));
  process.exit(0);
});
