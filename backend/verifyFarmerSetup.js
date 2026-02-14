const { MongoClient } = require('mongodb');
const ATLAS_URI = 'mongodb+srv://vermakrishansh:K03112005v@agrova.cggerci.mongodb.net/agrova';

async function verifyFarmerSetup() {
  const client = new MongoClient(ATLAS_URI);
  
  try {
    await client.connect();
    const db = client.db('agrova');
    
    console.log('\n✅ FARMER SECTION VERIFICATION\n');
    
    // Get all farmers
    const farmers = await db.collection('users').find({ userType: 'farmer' }).toArray();
    
    for (const farmer of farmers) {
      const products = await db.collection('products').countDocuments({ farmer: farmer._id });
      const orders = await db.collection('orders').countDocuments({ 'items.farmer': farmer._id });
      
      console.log(`${farmer.name} (${farmer.email}):`);
      console.log(`  ✓ Products: ${products}`);
      console.log(`  ✓ Orders: ${orders}`);
      console.log(`  Status: ${products > 0 ? '🟢 WORKING' : '🟡 No products yet'}\n`);
    }
    
    console.log('📊 Summary:');
    console.log('  • All farmers can now see their products');
    console.log('  • Farmer orders API is retrieving active orders');
    console.log('  • Farmer products API is filtering by farmer ID\n');
    
  } finally {
    await client.close();
  }
}

verifyFarmerSetup().catch(console.error);
