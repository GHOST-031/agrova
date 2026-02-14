const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✅ Connected to MongoDB');
  
  console.log('\nFetching products from MongoDB collection directly:\n');
  
  const products = await mongoose.connection.collection('products').find({}).toArray();
  
  console.log(`Total products: ${products.length}\n`);
  
  products.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.name}`);
    console.log(`   _id: ${p._id}`);
    console.log(`   status: ${p.status}`);
    console.log(`   stock: ${p.stock}`);
    console.log('');
  });
  
  // Check specifically for the ID we're looking for
  const targetId = new mongoose.Types.ObjectId('690a2e5572bc15ceafcc46ea');
  const found = products.find(p => p._id.equals(targetId));
  console.log(`\nLooking for ID: 690a2e5572bc15ceafcc46ea`);
  console.log(`Found in array: ${found ? 'YES - ' + found.name : 'NO'}`);
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
