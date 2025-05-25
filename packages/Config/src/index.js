const logger        = require('./logger');          // exports console
const { connectMongo } = require('./db');           // function from db.js

module.exports = { logger, connectMongo };