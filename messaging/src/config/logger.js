const { createLogger, format, transports } = require('winston');
const config = require('./config');

const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      // In production, you might want to remove console logs or adjust log format
      format: format.combine(format.colorize(), format.simple())
    })
  ]
});

module.exports = logger;
