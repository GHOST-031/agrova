const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Replace with your Atlas connection string
const ATLAS_URI = 'mongodb+srv://vermakrishansh:K03112005v@agrova.cggerci.mongodb.net/?appName=agrova';
const DB_NAME = 'agrova';

async function importData() {
  const client = new MongoClient(ATLAS_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db(DB_NAME);
    const exportDir = path.join(__dirname, 'data-export');
    
    if (!fs.existsSync(exportDir)) {
      console.error('❌ Export directory not found. Run exportData.js first.');
      return;
    }
    
    const files = fs.readdirSync(exportDir).filter(f => f.endsWith('.json'));
    
    console.log(`\n📦 Importing ${files.length} collections...\n`);
    
    for (const file of files) {
      const collectionName = file.replace('.json', '');
      const filePath = path.join(exportDir, file);
      const documents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (documents.length > 0) {
        const collection = db.collection(collectionName);
        
        // Clear existing data (optional - remove this if you want to keep existing data)
        await collection.deleteMany({});
        
        // Insert documents
        await collection.insertMany(documents);
        console.log(`✅ ${collectionName}: ${documents.length} documents imported`);
      }
    }
    
    console.log('\n✨ Import complete! Your data is now on MongoDB Atlas.');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await client.close();
  }
}

importData();
