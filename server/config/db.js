import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      process.env.SPRING_DATA_MONGODB_URI ||
      'mongodb://127.0.0.1:27017/voicehire';

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[VoiceHire MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Notice]: Could not connect to remote MongoDB cluster (${error.message}). Running with in-memory persistence fallback for seamless operation.`);
    return null;
  }
};

export default connectDB;
