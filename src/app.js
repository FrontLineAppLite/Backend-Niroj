require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./controllers/authController');
const userRoutes = require('./controllers/userController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;
