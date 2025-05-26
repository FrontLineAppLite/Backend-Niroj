const router = require('express').Router();
const requireAuth = require('@frontline/common').auth;
const { tokenUtils } = require('@frontline/common');
const { verifyToken } = tokenUtils;

// Example route to get profile data
router.get('/me', requireAuth, async (req, res) => {
  // authMiddleware might decode token & attach user info to req.user
  return res.json({ user: req.user });
});

// Additional user management routes (assign roles, etc.) could go here

module.exports = router;