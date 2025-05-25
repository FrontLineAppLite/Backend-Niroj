require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const { errorHandler } = require('@frontline/common');
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/announcements', announcementRoutes);

// health-check
app.get('/health', (_req,res)=>res.json({ ok:true, service:'announcement' }));

// global error handler
app.use(errorHandler);

module.exports = app;