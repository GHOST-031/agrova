const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✅ Connected to MongoDB');
  
  console.log('\nFetching ALL products (no filters)...\n');
  
  const products = await Product.find({});
  
  console.log(`Total products found: ${products.length}\n`);
  
  products.forEach((p, idx) => {
    console.log(`${idx + 1}. ${p.name}`);
    console.log(`   ID: ${p._id}`);
    console.log(`   Status: ${p.status}`);
    console.log(`   Stock: ${p.stock}`);
    console.log(`   Category: ${p.category}`);
    console.log(`   Farmer: ${p.farmer}\n`);
  });
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
