const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('MongoDB connected (Messaging Microservice)');
  } catch (error) {
    logger.error('MongoDB connection error: %o', error);
    process.exit(1); // Crash if DB not connected
  }
};

module.exports = connectDB;
