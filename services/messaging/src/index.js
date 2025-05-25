// src/index.js
const http = require('http');
const { Server }        = require('socket.io');
const { logger, connectMongo } = require('@frontline/config');
const config            = require('./config/config');
const app = require('./app');
const { setupSocketIO } = require('./socket'); // We'll create 'socket.js'

// 1) Connect to MongoDB
connectMongo(config.mongoURI);

// 2) Create an HTTP server from the Express app
const server = http.createServer(app);

// 3) Initialize Socket.IO on that server
const io = new Server(server, {
  cors: {
    // Adjust origins as needed; in ECS behind an ALB, you might set to "*"
    origin: "*"
  }
})
app.set('io', io); // attach io to app so it's accessible in controllers

// 4) Pass the Socket.IO instance to our setup function
setupSocketIO(io);

// 5) Start listening on the configured port
server.listen(config.port, () => {
  logger.info(`Messaging microservice running on port ${config.port}`);
});

