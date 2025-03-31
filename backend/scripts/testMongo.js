// scripts/testMongo.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Set a longer timeout
const uri = process.env.MONGODB_URI;
console.log('Using connection string:', uri.replace(/:[^:]*@/, ':****@'));

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 30000, // 30 seconds
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000
});

async function run() {
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    
    // Simple ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged deployment. Connection confirmed!");
    
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

run().catch(console.error);