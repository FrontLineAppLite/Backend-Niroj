// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Load user from MongoDB
    const user = await User.findById(payload.userId).exec();
    if (!user) throw new Error('User not found');

    // Attach user info to request
    req.user = {
      id: user._id,
      email: user.email,
      roles: payload.roles, // If your token includes roles
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

module.exports = {
  requireAuth,
};
