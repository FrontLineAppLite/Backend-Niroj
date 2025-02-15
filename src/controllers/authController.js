const router = require('express').Router();
const authService = require('../services/authService');

/**
 * Registration: purely referencing an already-created Okta user.
 * - OPTIONAL: Only keep this if you want an API to store local info (role, name) once Okta user is created.
 */
router.post('/register', async (req, res) => {
  try {
    /**
     * Expected body:
     * {
     *   "email": "jane.doe@example.com",
     *   "firstName": "Jane",
     *   "lastName": "Doe",
     *   "roleId": 3,
     *   "oktaId": "00u12345abcXYZ"
     * }
     */
    const response = await authService.register(req.body);
    return res.status(201).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * Login: delegated to Okta. 
 * We expect an Okta token in req.body, e.g. { "authProviderToken": "<OktaIDToken>" }.
 */
router.post('/login', async (req, res) => {
  try {
    const tokens = await authService.login(req.body);
    return res.json(tokens);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

/**
 * Verify Token: checks your internal token (if you create one),
 * or you can verify Okta tokens directly.
 */
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    const user = await authService.verifyToken(token);
    return res.json({ valid: true, user });
  } catch (error) {
    return res.status(401).json({ valid: false, error: error.message });
  }
});

/**
 * Reset Password: defers to Okta
 */
router.post('/reset-password', async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
