const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const LOCAL_URI = 'mongodb://localhost:27017';
const DB_NAME = 'agrova';

async function exportData() {
  const client = new MongoClient(LOCAL_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to local MongoDB');
    
    const db = client.db(DB_NAME);
    const collections = await db.listCollections().toArray();
    
    const exportDir = path.join(__dirname, 'data-export');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }
    
    console.log(`\n📦 Exporting ${collections.length} collections...\n`);
    
    for (const collInfo of collections) {
      const collectionName = collInfo.name;
      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();
      
      if (documents.length > 0) {
        const filePath = path.join(exportDir, `${collectionName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
        console.log(`✅ ${collectionName}: ${documents.length} documents`);
      }
    }
    
    console.log(`\n✨ Export complete! Files saved to: ${exportDir}`);
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await client.close();
  }
}

exportData();
