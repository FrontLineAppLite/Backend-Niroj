// packages/config/src/db.js
const mongoose = require('mongoose');
const logger = require('./logger');

const connectMongo = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info(`MongoDB connected to ${uri}`);
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = { connectMongo };