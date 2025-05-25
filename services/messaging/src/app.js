const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('@frontline/config').logger;
const errorHandler = require('@frontline/common').errorHandler;

const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
const presenceRoutes = require('./routes/presenceRoutes');
const fileRoutes = require('./routes/fileRoutes');
const reactionRoutes = require('./routes/reactionRoutes');
const devPreviewRoutes = require('./routes/devPreviewRoutes');

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

if (process.env.NODE_ENV !== 'production') {                       
  app.use(devPreviewRoutes);
}

/* ───────────── DEV seeding endpoint ───────────── */
if (process.env.BYPASS_AUTH === '1') {
  const seed = require('./dev/seed');
  app.post('/dev/seed', async (_req, res, next) => {
    try   { await seed(); res.json({ ok:true }); }
    catch (e){ next(e); }
  });
}


// Health‑check endpoint (for ALB / k8s probes / Docker HEALTCHECK)
app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true, service: 'messaging' });
  });

/* ─── dev helpers ─────────────────────────────────────────── */
if (process.env.BYPASS_AUTH === '1' && process.env.NODE_ENV !== 'production') {
  app.use('/dev', require('./routes/devRoutes'));
}

// Central error handler
app.use(errorHandler);

module.exports = app;
