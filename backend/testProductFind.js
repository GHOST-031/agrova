const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✅ Connected to MongoDB');
  
  const productId = '690a2e5572bc15ceafcc46ea';
  console.log('\nTesting Product.findById:', productId);
  
  const product = await Product.findById(productId);
  console.log('Result:', product ? 'FOUND' : 'NOT FOUND');
  
  if (product) {
    console.log('- Name:', product.name);
    console.log('- Status:', product.status);
    console.log('- Stock:', product.stock);
    console.log('- Category:', product.category);
    console.log('- Farmer:', product.farmer);
  } else {
    console.log('\nTrying Product.find instead...');
    const products = await Product.find({ _id: productId });
    console.log('Find result count:', products.length);
    if (products.length > 0) {
      console.log('- Found with find()!');
      console.log('- Name:', products[0].name);
    }
    
    // Try finding any product
    console.log('\nTrying to find ANY active product...');
    const anyProduct = await Product.findOne({ status: 'active' });
    console.log('Any product found:', anyProduct ? 'YES' : 'NO');
    if (anyProduct) {
      console.log('- ID:', anyProduct._id);
      console.log('- Name:', anyProduct.name);
    }
  }
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
