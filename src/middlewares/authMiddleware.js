const jwt = require('jsonwebtoken');
const knex = require('knex');
const config = require('../../knexfile');
const db = knex(config[process.env.NODE_ENV || 'development']);

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally load user from DB
    const user = await db('users').where({ id: payload.userId }).first();
    if (!user) throw new Error('User not found');

    req.user = {
      id: user.id,
      email: user.email,
      roles: payload.roles, // or fetch from DB
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

module.exports = {
  requireAuth,
};
