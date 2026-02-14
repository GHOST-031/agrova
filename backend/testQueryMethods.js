const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✅ Connected to MongoDB');
  
  const productId = '690a2e5572bc15ceafcc46ea';
  console.log('\nTesting different query methods:\n');
  
  // Test 1: findById
  console.log('1. Product.findById()');
  const Product = require('./models/Product');
  const p1 = await Product.findById(productId);
  console.log('   Result:', p1 ? 'FOUND' : 'NOT FOUND');
  
  // Test 2: findById with lean
  console.log('\n2. Product.findById().lean()');
  const p2 = await Product.findById(productId).lean();
  console.log('   Result:', p2 ? 'FOUND' : 'NOT FOUND');
  
  // Test 3: findOne
  console.log('\n3. Product.findOne({ _id })');
  const p3 = await Product.findOne({ _id: productId });
  console.log('   Result:', p3 ? 'FOUND' : 'NOT FOUND');
  
  // Test 4: findOne with lean
  console.log('\n4. Product.findOne({ _id }).lean()');
  const p4 = await Product.findOne({ _id: productId }).lean();
  console.log('   Result:', p4 ? 'FOUND' : 'NOT FOUND');
  if (p4) {
    console.log('   Name:', p4.name);
    console.log('   Category:', p4.category);
    console.log('   Farmer:', p4.farmer);
  }
  
  // Test 5: Direct MongoDB query
  console.log('\n5. Direct MongoDB collection query');
  const p5 = await mongoose.connection.collection('products').findOne({ _id: new mongoose.Types.ObjectId(productId) });
  console.log('   Result:', p5 ? 'FOUND' : 'NOT FOUND');
  if (p5) {
    console.log('   Name:', p5.name);
    console.log('   Category:', p5.category);
    console.log('   Farmer:', p5.farmer);
  }
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
