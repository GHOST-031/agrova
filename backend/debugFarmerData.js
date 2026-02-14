const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const ATLAS_URI = 'mongodb+srv://vermakrishansh:K03112005v@agrova.cggerci.mongodb.net/agrova';

async function debugFarmerData() {
  const client = new MongoClient(ATLAS_URI);
  
  try {
    await client.connect();
    const db = client.db('agrova');
    
    console.log('\n=== FARMER DATA DEBUG ===\n');
    
    // Get all users with farmer role
    console.log('📋 Farmers in database:');
    const farmers = await db.collection('users').find({ userType: 'farmer' }).toArray();
    farmers.forEach(f => {
      console.log(`  - ${f.name} (${f.email}): ID = ${f._id}`);
    });
    
    // Get products and check farmer field
    console.log('\n📦 Products and their farmer assignments:');
    const products = await db.collection('products').find({}).toArray();
    console.log(`Total products: ${products.length}`);
    
    const withoutFarmer = products.filter(p => !p.farmer);
    const withFarmer = products.filter(p => p.farmer);
    
    console.log(`  - With farmer: ${withFarmer.length}`);
    console.log(`  - Without farmer: ${withoutFarmer.length}`);
    
    if (withFarmer.length > 0) {
      console.log('\n  Products WITH farmer:');
      withFarmer.slice(0, 3).forEach(p => {
        console.log(`    • ${p.name} -> Farmer: ${p.farmer}`);
      });
    }
    
    if (withoutFarmer.length > 0) {
      console.log('\n  Products WITHOUT farmer:');
      withoutFarmer.slice(0, 3).forEach(p => {
        console.log(`    • ${p.name}`);
      });
    }
    
    // Get orders and check items.farmer field
    console.log('\n📦 Orders and their items.farmer assignments:');
    const orders = await db.collection('orders').find({}).toArray();
    console.log(`Total orders: ${orders.length}`);
    
    if (orders.length > 0) {
      const firstOrder = orders[0];
      console.log('\n  First order items:');
      firstOrder.items.forEach((item, idx) => {
        console.log(`    Item ${idx}: ${item.name} - Farmer: ${item.farmer || 'NOT SET'}`);
      });
    }
    
    // Check if any farmer has orders
    console.log('\n🔍 Orders for each farmer:');
    for (const farmer of farmers.slice(0, 3)) {
      const farmerOrders = await db.collection('orders')
        .find({ 'items.farmer': farmer._id })
        .toArray();
      console.log(`  ${farmer.name}: ${farmerOrders.length} orders`);
    }
    
  } finally {
    await client.close();
  }
}

debugFarmerData().catch(console.error);
