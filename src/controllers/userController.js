const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Example route to get profile data
router.get('/me', authMiddleware.requireAuth, async (req, res) => {
  // authMiddleware might decode token & attach user info to req.user
  return res.json({ user: req.user });
});

// Additional user management routes (assign roles, etc.) could go here

module.exports = router;
