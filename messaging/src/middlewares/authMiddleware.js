const axios = require('axios');
const config = require('../config/config');   // to retrieve AUTH_SERVICE_URL
const logger = require('../config/logger');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No Bearer token provided' });
  }

  try {
    // Call the Auth microservice to verify the token
    const verifyUrl = `${config.authServiceUrl}/auth/verify`; 
    const response = await axios.get(verifyUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // If the auth microservice says valid = false, or fails:
    if (!response.data || !response.data.valid) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Attach user to req
    // "response.data.user" will look like { user: { user: { ... } } } depending on your auth service
    // You might structure it to just do:
    req.user = response.data.user.user;  // or just "response.data.user"

    return next();
  } catch (err) {
    logger.error('Authorization error: %o', err);
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
