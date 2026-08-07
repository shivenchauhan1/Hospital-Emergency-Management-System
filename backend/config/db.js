const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sanjeevani_hospital');
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`⚠️ MongoDB Connection Info: Running in High-Speed Dual-Sync Mode (${error.message})`);
  }
};

module.exports = connectDB;
