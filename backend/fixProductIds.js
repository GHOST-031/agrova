const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✅ Connected to MongoDB');
  
  console.log('\nStarting data migration...\n');
  
  const db = mongoose.connection.db;
  const products = db.collection('products');
  
  // Get all products
  const allProducts = await products.find({}).toArray();
  console.log(`Found ${allProducts.length} products`);
  
  // Create new array with proper ObjectIds
  const correctedProducts = allProducts.map(p => {
    const corrected = { ...p };
    
    // Convert string _id to ObjectId if it's not already
    if (typeof corrected._id === 'string') {
      try {
        corrected._id = new mongoose.Types.ObjectId(corrected._id);
      } catch (e) {
        console.log(`Warning: Could not convert _id for ${p.name}`);
        return null;
      }
    }
    
    // Convert other ObjectId references
    if (corrected.category && typeof corrected.category === 'string') {
      try {
        corrected.category = new mongoose.Types.ObjectId(corrected.category);
      } catch (e) {
        corrected.category = null;
      }
    }
    
    if (corrected.farmer && typeof corrected.farmer === 'string') {
      try {
        corrected.farmer = new mongoose.Types.ObjectId(corrected.farmer);
      } catch (e) {
        corrected.farmer = null;
      }
    }
    
    // Fix images array
    if (corrected.images && Array.isArray(corrected.images)) {
      corrected.images = corrected.images.map(img => {
        const correctedImg = { ...img };
        if (correctedImg._id && typeof correctedImg._id === 'string') {
          try {
            correctedImg._id = new mongoose.Types.ObjectId(correctedImg._id);
          } catch (e) {
            delete correctedImg._id;
          }
        }
        return correctedImg;
      });
    }
    
    return corrected;
  }).filter(p => p !== null);
  
  console.log(`Creating corrected products: ${correctedProducts.length}`);
  
  // Delete old collection
  await products.deleteMany({});
  console.log('✅ Cleared products collection');
  
  // Insert corrected products
  if (correctedProducts.length > 0) {
    const result = await products.insertMany(correctedProducts);
    console.log(`✅ Inserted ${result.insertedIds.length} products`);
  }
  
  console.log('\nVerifying conversion...\n');
  
  // Verify
  const testId = '690a2e5572bc15ceafcc46ea';
  const verifyOid = await products.findOne({ _id: new mongoose.Types.ObjectId(testId) });
  const verifyString = await products.findOne({ _id: testId });
  
  console.log(`Query with ObjectId: ${verifyOid ? 'FOUND - ' + verifyOid.name : 'NOT FOUND'}`);
  console.log(`Query with string: ${verifyString ? 'FOUND - ' + verifyString.name : 'NOT FOUND'}`);
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
