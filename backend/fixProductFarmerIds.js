const { MongoClient, ObjectId } = require('mongodb');
const ATLAS_URI = 'mongodb+srv://vermakrishansh:K03112005v@agrova.cggerci.mongodb.net/agrova';

async function fixProductFarmerIds() {
  const client = new MongoClient(ATLAS_URI);
  
  try {
    await client.connect();
    const db = client.db('agrova');
    
    console.log('🔧 Checking farmer field types in products...\n');
    
    const products = await db.collection('products').find({}).toArray();
    
    if (products.length === 0) {
      console.log('No products found');
      return;
    }
    
    console.log(`First product:
    Name: ${products[0].name}
    Farmer: ${products[0].farmer}
    Type: ${typeof products[0].farmer}
    Is ObjectId: ${products[0].farmer instanceof ObjectId}
    \n`);
    
    // Check if farmers are strings
    const needsConversion = products.filter(p => 
      p.farmer && typeof p.farmer === 'string'
    );
    
    if (needsConversion.length === 0) {
      console.log('✅ All farmer fields are already ObjectIds');
      return;
    }
    
    console.log(`Found ${needsConversion.length} products with string farmer IDs\n`);
    console.log('Converting string farmer IDs to ObjectIds...\n');
    
    let updateCount = 0;
    for (const product of products) {
      if (product.farmer && typeof product.farmer === 'string') {
        const result = await db.collection('products').updateOne(
          { _id: product._id },
          { $set: { farmer: new ObjectId(product.farmer) } }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`✓ ${product.name} - converted farmer ID`);
          updateCount++;
        }
      }
    }
    
    console.log(`\n✅ Converted ${updateCount} products\n`);
    
    // Verify the fix
    console.log('🔍 Verifying...\n');
    const updated = await db.collection('products').findOne({ farmer: new ObjectId('690619711077cebc1ac3e8e7') });
    if (updated) {
      console.log(`✅ Found product by ObjectId farmer query: ${updated.name}`);
    } else {
      console.log('❌ No products found by ObjectId farmer query');
    }
    
  } finally {
    await client.close();
  }
}

fixProductFarmerIds().catch(console.error);
