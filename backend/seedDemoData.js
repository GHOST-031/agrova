const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Address = require('./models/Address');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const seedDemoData = async () => {
  try {
    console.log('🌱 Starting demo data seeding for your presentation accounts...');

    // Find your actual accounts
    const consumerUser = await User.findOne({ email: 'vermakrishansh@gmail.com' });
    const farmerUser = await User.findOne({ email: 'vermaashwani@hotmail.com' });

    if (!consumerUser) {
      console.error('❌ Consumer account (vermakrishansh@gmail.com) not found!');
      console.log('Please create it first by logging in to the app.');
      process.exit(1);
    }

    if (!farmerUser) {
      console.error('❌ Farmer account (vermaashwani@hotmail.com) not found!');
      console.log('Please create it first by logging in to the app.');
      process.exit(1);
    }

    console.log(`✅ Found consumer: ${consumerUser.name} (${consumerUser.email})`);
    console.log(`✅ Found farmer: ${farmerUser.name} (${farmerUser.email})`);

    // Update farmer profile with complete details
    farmerUser.phoneNumber = '+91 98765 43210';
    farmerUser.farmDetails = {
      farmName: 'Verma Organic Farm',
      farmSize: '10 acres',
      location: {
        address: 'Village Khairpur, Near Highway',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122103',
        coordinates: {
          latitude: 28.3500,
          longitude: 77.1200
        }
      },
      certifications: ['Organic India Certified', 'Fair Trade', 'ISO 22000'],
      specialties: ['Organic Vegetables', 'Fresh Fruits', 'Dairy Products', 'Herbs']
    };
    await farmerUser.save();
    console.log('✅ Updated farmer profile with farm details');

    // Update consumer profile
    consumerUser.phoneNumber = '+91 98765 54321';
    await consumerUser.save();
    console.log('✅ Updated consumer profile');

    // Create addresses for consumer (for demo/presentation)
    await Address.deleteMany({ user: consumerUser._id });
    
    const addresses = [
      {
        user: consumerUser._id,
        name: 'Home',
        phone: '+91 98765 54321',
        street: '456, Sector 14, DLF Phase 3',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        country: 'India',
        latitude: 28.4695,
        longitude: 77.0760,
        isDefault: true,
        addressType: 'home'
      },
      {
        user: consumerUser._id,
        name: 'Office',
        phone: '+91 98765 54321',
        street: 'Tower A, Cyber Hub, DLF Cyber City',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        country: 'India',
        latitude: 28.4950,
        longitude: 77.0890,
        landmark: 'Near Cyber Hub Metro',
        isDefault: false,
        addressType: 'work'
      }
    ];

    const createdAddresses = await Address.insertMany(addresses);
    console.log(`✅ Created ${createdAddresses.length} addresses for consumer`);

    // Get some products for creating orders
    const products = await Product.find({ farmer: farmerUser._id }).limit(5);
    
    if (products.length === 0) {
      console.log('⚠️  No products found. Please run seedProducts.js first!');
    } else {
      console.log(`✅ Found ${products.length} products for orders`);

      // Create sample orders for the consumer (for presentation)
      await Order.deleteMany({ user: consumerUser._id });

      const sampleOrders = [
        {
          orderId: `ORD${Date.now()}A`,
          user: consumerUser._id,
          items: [
            {
              product: products[0]._id,
              name: products[0].name,
              quantity: 2,
              price: products[0].price,
              farmer: farmerUser._id,
              image: products[0].images[0]?.url || ''
            },
            {
              product: products[1]._id,
              name: products[1].name,
              quantity: 1,
              price: products[1].price,
              farmer: farmerUser._id,
              image: products[1].images[0]?.url || ''
            }
          ],
          deliveryAddress: {
            name: 'Home',
            phone: '+91 98765 54321',
            street: '456, Sector 14, DLF Phase 3',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002',
            country: 'India',
            latitude: 28.4695,
            longitude: 77.0760
          },
          payment: {
            method: 'upi',
            status: 'success',
            transactionId: `TXN${Date.now()}001`,
            paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          pricing: {
            subtotal: products[0].price * 2 + products[1].price,
            delivery: 40,
            discount: 0,
            tax: 0,
            total: products[0].price * 2 + products[1].price + 40
          },
          status: 'delivered',
          deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          orderId: `ORD${Date.now()}B`,
          user: consumerUser._id,
          items: [
            {
              product: products[2]._id,
              name: products[2].name,
              quantity: 3,
              price: products[2].price,
              farmer: farmerUser._id,
              image: products[2].images[0]?.url || ''
            }
          ],
          deliveryAddress: {
            name: 'Office',
            phone: '+91 98765 54321',
            street: 'Tower A, Cyber Hub, DLF Cyber City',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002',
            country: 'India',
            latitude: 28.4950,
            longitude: 77.0890
          },
          payment: {
            method: 'card',
            status: 'success',
            transactionId: `TXN${Date.now()}002`,
            paidAt: new Date()
          },
          pricing: {
            subtotal: products[2].price * 3,
            delivery: 40,
            discount: 20,
            tax: 0,
            total: products[2].price * 3 + 40 - 20
          },
          status: 'shipped',
          shippedAt: new Date(),
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
        },
        {
          orderId: `ORD${Date.now()}C`,
          user: consumerUser._id,
          items: [
            {
              product: products[3]._id,
              name: products[3].name,
              quantity: 1,
              price: products[3].price,
              farmer: farmerUser._id,
              image: products[3].images[0]?.url || ''
            },
            {
              product: products[4]._id,
              name: products[4].name,
              quantity: 2,
              price: products[4].price,
              farmer: farmerUser._id,
              image: products[4].images[0]?.url || ''
            }
          ],
          deliveryAddress: {
            name: 'Home',
            phone: '+91 98765 54321',
            street: '456, Sector 14, DLF Phase 3',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002',
            country: 'India'
          },
          payment: {
            method: 'cod',
            status: 'pending',
            transactionId: ''
          },
          pricing: {
            subtotal: products[3].price + products[4].price * 2,
            delivery: 40,
            discount: 0,
            tax: 0,
            total: products[3].price + products[4].price * 2 + 40
          },
          status: 'confirmed',
          createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        }
      ];

      const createdOrders = await Order.insertMany(sampleOrders);
      console.log(`✅ Created ${createdOrders.length} sample orders for consumer`);

      // Show order details
      createdOrders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order ${order.orderId} - Status: ${order.status} - Total: ₹${order.pricing.total}`);
      });
    }

    console.log('\n🎉 Demo data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Consumer account: ${consumerUser.email}`);
    console.log(`   - Farmer account: ${farmerUser.email}`);
    console.log(`   - Addresses created: ${createdAddresses.length}`);
    console.log(`   - Sample orders: ${products.length > 0 ? 3 : 0}`);
    console.log('\n💡 These demo data are ONLY for your presentation accounts:');
    console.log(`   - vermakrishansh@gmail.com (Consumer)`);
    console.log(`   - vermaashwani@hotmail.com (Farmer)`);
    console.log('   New users who sign up will start with a clean slate!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
};

seedDemoData();
