const { MongoClient } = require('mongodb');
const ATLAS_URI = 'mongodb+srv://vermakrishansh:K03112005v@agrova.cggerci.mongodb.net/agrova';

async function fixFarmerAssignments() {
  const client = new MongoClient(ATLAS_URI);
  
  try {
    await client.connect();
    const db = client.db('agrova');
    
    console.log('🔧 Fixing farmer product and order assignments...\n');
    
    // Get all farmers
    const farmers = await db.collection('users').find({ userType: 'farmer' }).toArray();
    console.log(`Found ${farmers.length} farmers`);
    farmers.forEach(f => console.log(`  - ${f.name}: ${f._id}`));
    
    if (farmers.length === 0) {
      console.log('No farmers found!');
      return;
    }
    
    // Get all products
    const products = await db.collection('products').find({}).toArray();
    console.log(`\n📦 Found ${products.length} products\n`);
    
    // Distribute products evenly among farmers
    const productsPerFarmer = Math.ceil(products.length / farmers.length);
    
    let updateCount = 0;
    for (let i = 0; i < products.length; i++) {
      const farmerIndex = Math.floor(i / productsPerFarmer) % farmers.length;
      const newFarmerId = farmers[farmerIndex]._id;
      
      const result = await db.collection('products').updateOne(
        { _id: products[i]._id },
        { $set: { farmer: newFarmerId } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✓ Product: ${products[i].name} -> Farmer: ${farmers[farmerIndex].name}`);
        updateCount++;
      }
    }
    
    console.log(`\n✅ Updated ${updateCount} products\n`);
    
    // Now update orders to match the new farmer assignments
    console.log('📋 Updating orders to match new farmer assignments...\n');
    
    const orders = await db.collection('orders').find({}).toArray();
    
    let orderUpdateCount = 0;
    for (const order of orders) {
      let modified = false;
      
      for (let itemIdx = 0; itemIdx < order.items.length; itemIdx++) {
        const item = order.items[itemIdx];
        
        // Find the product to get its new farmer
        const product = await db.collection('products').findOne({ _id: item.product });
        
        if (product && product.farmer) {
          const oldFarmer = item.farmer ? item.farmer.toString() : 'null';
          const newFarmer = product.farmer.toString();
          
          if (oldFarmer !== newFarmer) {
            order.items[itemIdx].farmer = product.farmer;
            modified = true;
          }
        }
      }
      
      if (modified) {
        await db.collection('orders').updateOne(
          { _id: order._id },
          { $set: { items: order.items } }
        );
        orderUpdateCount++;
      }
    }
    
    console.log(`✅ Updated ${orderUpdateCount} orders\n`);
    
    // Show summary
    console.log('📊 SUMMARY\n');
    for (const farmer of farmers) {
      const farmerProducts = await db.collection('products')
        .countDocuments({ farmer: farmer._id });
      const farmerOrders = await db.collection('orders')
        .countDocuments({ 'items.farmer': farmer._id });
      
      console.log(`${farmer.name}:`);
      console.log(`  Products: ${farmerProducts}`);
      console.log(`  Orders: ${farmerOrders}\n`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

fixFarmerAssignments();
