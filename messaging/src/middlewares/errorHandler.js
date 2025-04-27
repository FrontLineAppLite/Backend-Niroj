const logger = require('../config/logger');

// Express identifies this by 4 parameters: (err, req, res, next)
function errorHandler(err, req, res, next) {
  logger.error('%o', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ success: false, message });
}

module.exports = errorHandler; 
