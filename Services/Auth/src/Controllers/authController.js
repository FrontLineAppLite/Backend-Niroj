const router      = require('express').Router();
const authService = require('../utils/authService');

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const created = await authService.register(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const tokens = await authService.login(req.body);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// GET /auth/verify
router.get('/verify', async (req, res) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    const user  = await authService.verifyToken(token);
    res.json({
      valid: true,
      user : {
        id   : user.user._id,
        email: user.user.email,
        roles: user.user.roles || []
      }
    });
  } catch (err) {
    res.status(401).json({ valid: false, error: err.message });
  }
});

// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const out = await authService.resetPassword(req.body);
    res.json(out);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;