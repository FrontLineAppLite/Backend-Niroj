// services/auth/src/index.js
const app                   = require('./app');            // Express instance
const { connectMongo, logger } = require('@frontline/config');

const PORT = process.env.PORT || 4000;

(async () => {
  await connectMongo(process.env.MONGO_URL);
  app.listen(PORT, () => logger.info(`Auth running on ${PORT}`));
})();