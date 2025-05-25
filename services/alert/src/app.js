require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const { errorHandler } = require('@frontline/common');
const alertRoutes   = require('./routes/alertRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/alerts', alertRoutes);

// health-check
app.get('/health', (_req,res)=>res.json({ ok:true, service:'alert' }));

// global error handler
app.use(errorHandler);

module.exports = app;
