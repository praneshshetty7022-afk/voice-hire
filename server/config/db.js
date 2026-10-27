import mongoose from 'mongoose';
import dns from 'node:dns';

// Configure reliable DNS servers (Google, Cloudflare) for Node.js SRV resolution with MongoDB Atlas
const setupDns = () => {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch {
    // Keep system defaults if restricted
  }
};

const connectDB = async () => {
  // Support standard Atlas env vars across Render, Vercel, and local
  const rawURI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.SPRING_DATA_MONGODB_URI ||
    '';

  const isPlaceholder =
    !rawURI ||
    rawURI.includes('<username>') ||
    rawURI.includes('<password>') ||
    rawURI.includes('xxxx.mongodb.net') ||
    rawURI === 'mongodb+srv://veriproof_admin:veriproof_secure_2026@cluster0.mongodb.net/veriproof?retryWrites=true&w=majority';

  if (isPlaceholder) {
    console.log('\n--------------------------------------------------------------');
    console.log('ℹ️  [MongoDB Atlas Notice]: No active Atlas cluster URI provided');
    console.log('   To connect live MongoDB Atlas, set MONGO_URI in your .env or Render dashboard:');
    console.log('   MONGO_URI="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/voicehire?retryWrites=true&w=majority"');
    console.log('   Running in resilient fallback mode (in-memory persistence).');
    console.log('--------------------------------------------------------------\n');
    return null;
  }

  // If using SRV protocol, ensure public DNS is active to avoid local ISP ECONNREFUSED
  if (rawURI.startsWith('mongodb+srv://')) {
    setupDns();
  }

  try {
    const conn = await mongoose.connect(rawURI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log(`\n🍃 [MongoDB Atlas Connected]: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}\n`);
    return conn;
  } catch (error) {
    console.warn(`\n⚠️  [MongoDB Atlas Connection Error]: ${error.message}`);
    console.warn('   Running with in-memory persistence fallback for seamless operation.\n');
    return null;
  }
};

// Mongoose lifecycle listeners
mongoose.connection.on('connected', () => {
  console.log('🍃 Mongoose connected to MongoDB Atlas.');
});

mongoose.connection.on('error', (err) => {
  console.error('⚠️  Mongoose Atlas connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('ℹ️  Mongoose Atlas disconnected.');
});

export default connectDB;

