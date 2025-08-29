// Test MongoDB connection script
// Run this to test your MongoDB connection before starting the main server

import { MongoClient } from 'mongodb';

// Test connection string - replace with your actual password
const MONGODB_URI = "mongodb+srv://singlepk22:<db_password>@funding.ukkltp7.mongodb.net/smart_investment_platform?retryWrites=true&w=majority";

async function testConnection() {
  let client;
  
  try {
    console.log('Testing MongoDB connection...');
    
    client = new MongoClient(MONGODB_URI, {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      retryWrites: true,
      w: 'majority',
      serverApi: {
        version: '1',
        strict: false,
        deprecationErrors: false,
      },
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    const db = client.db('smart_investment_platform');
    console.log('✅ Database accessed successfully!');
    
    // Test collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test users collection
    const userCount = await db.collection('users').countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    // Test movies collection
    const movieCount = await db.collection('movies').countDocuments();
    console.log(`🎬 Movies in database: ${movieCount}`);
    
    // Test investments collection
    const investmentCount = await db.collection('investments').countDocuments();
    console.log(`💰 Investments in database: ${investmentCount}`);
    
    console.log('\n🎉 MongoDB connection test successful! You can now start the main server.');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure you replaced <db_password> with your actual password');
    console.log('2. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('3. Verify your MongoDB Atlas credentials');
    console.log('4. Try using a different network connection');
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Connection closed.');
    }
  }
}

testConnection(); 