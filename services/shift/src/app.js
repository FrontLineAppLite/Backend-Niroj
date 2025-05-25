require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const { errorHandler } = require('@frontline/common');
const shiftRoutes = require('./routes/shiftRoutes');
const shiftRequestRoutes = require('./routes/shiftRequestRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/shifts',         shiftRoutes);
app.use('/api/shiftRequests',  shiftRequestRoutes);

// health-check
app.get('/health', (_req,res)=>res.json({ ok:true, service:'shift' }));

// global error handler
app.use(errorHandler);

module.exports = app;