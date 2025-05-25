// services/auth/src/app.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes  = require('./controllers/authController');
const userRoutes  = require('./controllers/userController');

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/auth',  authRoutes);
app.use('/users', userRoutes);

module.exports = app;          // ← export just the app