const axios   = require('axios');
const logger  = require('@frontline/config').logger;   // use the shared logger

async function authMiddleware(req, res, next) {
  /* ─── DEV shortcut ──────────────────────────────────────────── */
  if (process.env.BYPASS_AUTH === '1') {
    // Attach a fake user so downstream code can still rely on req.user
    req.user = {
      id   : 'devUser',
      email: 'dev@example.com',
      roles: ['admin']
    };
    return next();
  }
  
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No Bearer token provided' });
  }

  try {
    // Call the Auth micro‑service to verify the token
    const base = process.env.AUTH_SERVICE_URL || 'http://auth:4000';
    const verifyUrl = `${base}/auth/verify`; 
    
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