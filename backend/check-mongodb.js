const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital_management';

async function checkMongoDB() {
  console.log('🔍 Checking MongoDB connection...');
  console.log(`📍 URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials
  
  const client = new MongoClient(mongoURI);
  
  try {
    await client.connect();
    console.log('✅ MongoDB is running and accessible!');
    
    // Test database operations
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collection(s)`);
    
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('\n💡 Solutions:');
    console.error('   1. Install MongoDB: https://www.mongodb.com/try/download/community');
    console.error('   2. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
    console.error('   3. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
    console.error('   4. Update MONGODB_URI in .env file with your connection string');
    process.exit(1);
  }
}

checkMongoDB();

