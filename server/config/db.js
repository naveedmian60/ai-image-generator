const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Could not connect to configured MONGODB_URI: ${err.message}`);
      if (process.env.NODE_ENV === 'production') {
        throw err;
      }
      console.log('[MongoDB] Falling back to In-Memory MongoDB for development...');
    }
  }

  // Fallback to MongoMemoryServer for effortless zero-config local run
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[MongoDB] Connected to In-Memory MongoDB Server at: ${memoryUri}`);
    console.log('[MongoDB] Tip: To persist data across server restarts, set MONGODB_URI in server/.env');
    return conn;
  } catch (memErr) {
    console.error(`[MongoDB] Failed to initialize In-Memory MongoDB: ${memErr.message}`);
    throw memErr;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, disconnectDB };

