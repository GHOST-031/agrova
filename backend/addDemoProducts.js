require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrova');
    console.log('Connected to MongoDB');
    
    const farmerId = '699074fe8f00b31eae608c27'; // Demo farmer
    
    // Check how many products exist for this farmer
    const count = await Product.countDocuments({ farmer: farmerId });
    console.log('Current products for demo farmer:', count);
    
    // Create sample products if this farmer has none
    if (count === 0) {
      const products = [
        {
          name: 'Demo Fresh Tomatoes',
          description: 'Fresh tomatoes from demo farm',
          price: 45,
          unit: 'kg',
          farmer: farmerId,
          stock: 50,
          status: 'active',
          isOrganic: true,
          isFreshProduce: true,
          images: [{ url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop' }]
        },
        {
          name: 'Demo Organic Carrots',
          description: 'Sweet and crunchy organic carrots',
          price: 35,
          unit: 'kg',
          farmer: farmerId,
          stock: 40,
          status: 'active',
          isOrganic: true,
          isFreshProduce: true,
          images: [{ url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop' }]
        },
        {
          name: 'Demo Fresh Milk',
          description: 'Pure, farm-fresh milk from grass-fed cows',
          price: 60,
          unit: 'liter',
          farmer: farmerId,
          stock: 35,
          status: 'active',
          isOrganic: true,
          isFreshProduce: true,
          images: [{ url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop' }]
        }
      ];
      
      const created = await Product.insertMany(products);
      console.log(`Created ${created.length} products for demo farmer`);
    } else {
      console.log('Demo farmer already has products');
    }
    
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
};

main();
