const express   = require('express');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('@frontline/common').errorHandler;

const app = express();
app.use(express.json());

app.use('/api/tasks', taskRoutes);
app.get('/health', (_req,res)=>res.json({ ok:true, service:'task' }));
app.use(errorHandler);

module.exports = { app };