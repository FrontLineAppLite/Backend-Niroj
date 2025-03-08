// src/config/database.js
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/auth_service_dev';

async function connectDB() {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB at', mongoUrl);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB;
