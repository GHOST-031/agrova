const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('./models/Product');
const User = require('./models/User');
const Category = require('./models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agrova')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Sample categories
const sampleCategories = [
  { name: "Vegetables", description: "Fresh vegetables", slug: "vegetables" },
  { name: "Fruits", description: "Fresh fruits", slug: "fruits" },
  { name: "Dairy", description: "Dairy products", slug: "dairy" },
  { name: "Grains", description: "Grains and cereals", slug: "grains" }
];

// Sample products data (without category IDs yet)
const sampleProducts = [
  {
    name: "Organic Tomatoes",
    description: "Fresh, juicy organic tomatoes grown without pesticides. Perfect for salads and cooking.",
    price: 45,
    unit: "kg",
    categorySlug: "vegetables",
    stock: 25,
    images: [{ url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop" }],
    tags: ["organic", "fresh", "vegetables", "tomatoes"],
    isOrganic: true,
    status: "active"
  },
  {
    name: "Fresh Spinach",
    description: "Nutrient-rich organic spinach, freshly harvested. Great for smoothies and cooking.",
    price: 30,
    unit: "kg",
    categorySlug: "vegetables",
    stock: 15,
    images: [{ url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop" }],
    tags: ["organic", "fresh", "vegetables", "spinach", "leafy greens"],
    isOrganic: true,
    status: "active"
  },
  {
    name: "Farm Fresh Eggs",
    description: "Free-range eggs from happy hens. Rich in protein and nutrients.",
    price: 96,
    unit: "dozen",
    categorySlug: "dairy",
    stock: 50,
    images: [{ url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop" }],
    tags: ["fresh", "eggs", "dairy", "protein", "free-range"],
    isOrganic: false,
    status: "active"
  },
  {
    name: "Organic Carrots",
    description: "Sweet and crunchy organic carrots. Perfect for snacking, juicing, or cooking.",
    price: 35,
    unit: "kg",
    categorySlug: "vegetables",
    stock: 20,
    images: [{ url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop" }],
    tags: ["organic", "fresh", "vegetables", "carrots", "root vegetables"],
    isOrganic: true,
    status: "active"
  },
  {
    name: "Bell Peppers",
    description: "Colorful, crisp bell peppers. Rich in vitamins and perfect for stir-fries.",
    price: 80,
    unit: "kg",
    categorySlug: "vegetables",
    stock: 18,
    images: [{ url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop" }],
    tags: ["fresh", "vegetables", "peppers", "colorful"],
    isOrganic: false,
    status: "active"
  },
  {
    name: "Fresh Milk",
    description: "Pure, farm-fresh milk from grass-fed cows. Delivered daily.",
    price: 60,
    unit: "liter",
    categorySlug: "dairy",
    stock: 30,
    images: [{ url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop" }],
    tags: ["fresh", "milk", "dairy", "organic"],
    isOrganic: true,
    status: "active"
  },
  {
    name: "Organic Potatoes",
    description: "Versatile organic potatoes, perfect for any dish. Freshly harvested.",
    price: 25,
    unit: "kg",
    categorySlug: "vegetables",
    stock: 40,
    images: [{ url: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop" }],
    tags: ["organic", "vegetables", "potatoes", "staple"],
    isOrganic: true,
    status: "active"
  },
  {
    name: "Fresh Onions",
    description: "Quality onions for all your cooking needs. Long shelf life.",
    price: 30,
    unit: "kg",
    categorySlug: "vegetables",
    stock: 35,
    images: [{ url: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop" }],
    tags: ["fresh", "vegetables", "onions", "cooking essentials"],
    isOrganic: false,
    status: "active"
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting product seeding...');
    
    // Find or create your farmer account
    let farmer = await User.findOne({ email: 'vermaashwani@hotmail.com' });
    
    if (!farmer) {
      console.log('❌ Farmer account vermaashwani@hotmail.com not found!');
      console.log('Please login to the app first to create this account.');
      process.exit(1);
    } else {
      console.log('✅ Found existing farmer:', farmer.email);
    }

    // Create or find categories
    console.log('\n📁 Setting up categories...');
    const categoryMap = {};
    
    for (const cat of sampleCategories) {
      let category = await Category.findOne({ slug: cat.slug });
      if (!category) {
        category = await Category.create(cat);
        console.log(`  ✅ Created category: ${cat.name}`);
      } else {
        console.log(`  ✅ Found category: ${cat.name}`);
      }
      categoryMap[cat.slug] = category._id;
    }

    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log(`\n⚠️  Found ${existingProducts} existing products`);
      console.log('Do you want to delete them and reseed? (Ctrl+C to cancel, wait 5 seconds to continue)');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      await Product.deleteMany({});
      console.log('🗑️  Deleted existing products');
    }

    // Add farmer ID and category ID to all products
    const productsToInsert = sampleProducts.map(product => {
      const { categorySlug, ...productData } = product;
      return {
        ...productData,
        farmer: farmer._id,
        category: categoryMap[categorySlug]
      };
    });

    // Insert products
    const insertedProducts = await Product.insertMany(productsToInsert);
    
    console.log(`\n✅ Successfully seeded ${insertedProducts.length} products!\n`);
    
    // Display the products with their IDs
    console.log('📋 Product IDs (you can use these for testing):\n');
    insertedProducts.forEach(product => {
      console.log(`   ${product.name}: ${product._id}`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n💡 You can now:');
    console.log('   1. Login to the app');
    console.log('   2. Browse products on the products page');
    console.log('   3. Add products to cart and wishlist');
    console.log('   4. Place orders');
    console.log('\n🔑 Test Credentials:');
    console.log('   Farmer: farmer@test.com / farmer123');
    console.log('   Consumer: test@test.com / test123 (if already created)\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();
