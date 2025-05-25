// services/announcement/src/index.js
const http                = require('http');
const app                 = require('./app');
const { logger, connectMongo } = require('@frontline/config');

const PORT = process.env.PORT || 5200;
const MONGO_URL = process.env.MONGO_URL;

(async () => {
  await connectMongo(MONGO_URL);
  http.createServer(app).listen(PORT, () =>
    logger.info(`Announcement service running on ${PORT}`)
  );
})();