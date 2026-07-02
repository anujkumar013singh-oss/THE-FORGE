const mongoose = require("mongoose");

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000
    });
    cachedDb = conn.connection;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return cachedDb;
  } catch (err) {
    console.error(`MongoDB error: ${err.message}`);
    throw err;
  }
};

module.exports = connectDB;
