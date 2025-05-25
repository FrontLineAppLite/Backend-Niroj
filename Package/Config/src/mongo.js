const mongoose = require('mongoose');
const logger = require('./logger');
module.exports = uri => mongoose.connect(uri)
  .then(() => logger.log('mongo connected'))
  .catch(err => logger.error(err));