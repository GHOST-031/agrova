const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✅ Connected to MongoDB');
  
  const targetIdString = '690a2e5572bc15ceafcc46ea';
  console.log(`\nSearching for product: ${targetIdString}\n`);
  
  // Get the product from collection
  const products = await mongoose.connection.collection('products').find({}).toArray();
  console.log(`Total products in collection: ${products.length}`);
  
  const product = products.find(p => p._id.toString() === targetIdString);
  
  if (product) {
    console.log(`\n✅ Found product: ${product.name}`);
    console.log(`   _id type: ${typeof product._id}`);
    console.log(`   _id value: ${product._id}`);
    console.log(`   _id toString(): ${product._id.toString()}`);
    console.log(`   _id constructor: ${product._id.constructor.name}`);
    
    // Try querying with different methods
    console.log('\n--- Query Tests ---\n');
    
    // Test 1: Query with string ID
    console.log('1. Query with string ID');
    const test1 = await mongoose.connection.collection('products').findOne({ _id: targetIdString });
    console.log(`   Result: ${test1 ? 'FOUND' : 'NOT FOUND'}`);
    
    // Test 2: Query with ObjectId
    console.log('\n2. Query with new ObjectId(string)');
    try {
      const test2 = await mongoose.connection.collection('products').findOne({ _id: new mongoose.Types.ObjectId(targetIdString) });
      console.log(`   Result: ${test2 ? 'FOUND' : 'NOT FOUND'}`);
    } catch(err) {
      console.log(`   Error: ${err.message}`);
    }
    
    // Test 3: Query with the actual _id from the document
    console.log('\n3. Query with actual _id from document');
    const test3 = await mongoose.connection.collection('products').findOne({ _id: product._id });
    console.log(`   Result: ${test3 ? 'FOUND' : 'NOT FOUND'}`);
  } else {
    console.log(`\n❌ Product not found in collection`);
  }
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
