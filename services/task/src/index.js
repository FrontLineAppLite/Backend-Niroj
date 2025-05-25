// services/task/src/index.js
const { app }   = require('./app');
const { logger, connectMongo } = require('@frontline/config');

const PORT = process.env.PORT || 5001;

(async () => {
  await connectMongo(process.env.MONGO_URL);
  app.listen(PORT, () => logger.info(`Task running on ${PORT}`));
})();