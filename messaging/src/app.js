const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./config/logger');
const errorHandler = require('./middlewares/errorHandler');

const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
const presenceRoutes = require('./routes/presenceRoutes');
const fileRoutes = require('./routes/fileRoutes');
const reactionRoutes = require('./routes/reactionRoutes');

const app = express();

// Security
app.use(helmet());

// Logging, JSON, CORS
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

// Routes
app.use('/api/chats', chatRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/presence', presenceRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/reactions', reactionRoutes);

// Healthcheck endpoint (for load balancers, etc.)
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Messaging microservice healthy' });
});

// Central error handler
app.use(errorHandler);

module.exports = app;
