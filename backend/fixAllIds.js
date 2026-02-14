const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function fixCollection(db, collectionName, idFields = ['_id']) {
  console.log(`\n📋 Processing ${collectionName}...`);
  
  const collection = db.collection(collectionName);
  const documents = await collection.find({}).toArray();
  
  if (documents.length === 0) {
    console.log(`   No documents found`);
    return;
  }
  
  console.log(`   Found: ${documents.length} documents`);
  
  let needsUpdate = false;
  
  // Check if we need to fix IDs
  for (const doc of documents.slice(0, 1)) { // Check first doc
    for (const field of idFields) {
      if (doc[field] && typeof doc[field] === 'string') {
        needsUpdate = true;
        break;
      }
    }
    if (needsUpdate) break;
  }
  
  if (!needsUpdate) {
    console.log(`   ✅ IDs already in correct ObjectId format`);
    return;
  }
  
  console.log(`   ⚠️ IDs are strings, converting to ObjectId...`);
  
  const corrected = documents.map(doc => {
    const updated = { ...doc };
    
    // Convert specified fields
    for (const field of idFields) {
      if (updated[field] && typeof updated[field] === 'string') {
        try {
          updated[field] = new mongoose.Types.ObjectId(updated[field]);
        } catch (e) {
          console.log(`   Warning: Could not convert ${field} for document`);
        }
      }
    }
    
    return updated;
  });
  
  // Delete and recreate
  await collection.deleteMany({});
  const result = await collection.insertMany(corrected);
  console.log(`   ✅ Updated ${result.insertedIds.length} documents`);
}

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('✅ Connected to MongoDB\n');
  
  const db = mongoose.connection.db;
  
  // Define which fields should be ObjectIds for each collection
  const collectionsToFix = {
    'products': ['_id', 'category', 'farmer'],
    'carts': ['_id', 'user'],
    'orders': ['_id', 'user'],
    'wishlists': ['_id', 'user'],
    'addresses': ['_id', 'user'],
    'categories': ['_id'],
    'users': ['_id'],
  };
  
  for (const [collectionName, idFields] of Object.entries(collectionsToFix)) {
    await fixCollection(db, collectionName, idFields);
  }
  
  console.log('\n✅ All collections updated!');
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
