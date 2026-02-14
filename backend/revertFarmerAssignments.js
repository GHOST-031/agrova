const { MongoClient } = require('mongodb');
const ATLAS_URI = 'mongodb+srv://vermakrishansh:K03112005v@agrova.cggerci.mongodb.net/agrova';

async function revertFarmerAssignments() {
  const client = new MongoClient(ATLAS_URI);
  
  try {
    await client.connect();
    const db = client.db('agrova');
    
    console.log('🔄 Reverting farmer product assignments to original state...\n');
    
    // Krishansh Verma's ID (the original farmer who owned all products)
    const krishanshFarmerId = '690619711077cebc1ac3e8e7';
    
    // Revert all products back to Krishansh Verma
    const result = await db.collection('products').updateMany(
      {},
      { $set: { farmer: krishanshFarmerId } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} products back to Krishansh Verma\n`);
    
    // Also revert orders to match
    const orders = await db.collection('orders').find({}).toArray();
    
    let orderUpdateCount = 0;
    for (const order of orders) {
      let modified = false;
      
      for (let itemIdx = 0; itemIdx < order.items.length; itemIdx++) {
        const item = order.items[itemIdx];
        if (!item.farmer || item.farmer.toString() !== krishanshFarmerId) {
          order.items[itemIdx].farmer = new (require('mongodb').ObjectId)(krishanshFarmerId);
          modified = true;
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
    
    // Show current state
    console.log('📊 CURRENT STATE:\n');
    const products = await db.collection('products').find({}).toArray();
    console.log(`Total products: ${products.length}\n`);
    
    const productsPerFarmer = {};
    products.forEach(p => {
      const farmerId = p.farmer?.toString();
      productsPerFarmer[farmerId] = (productsPerFarmer[farmerId] || 0) + 1;
    });
    
    for (const [farmerId, count] of Object.entries(productsPerFarmer)) {
      console.log(`Farmer ${farmerId}: ${count} products`);
    }
    
  } finally {
    await client.close();
  }
}

revertFarmerAssignments().catch(console.error);
