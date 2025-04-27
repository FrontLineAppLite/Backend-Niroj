const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateBody, validateParams } = require('../middlewares/validate');
const presenceController = require('../controllers/presenceController');
const {
  updatePresenceBody,
  userParamSchema
} = require('../validations/presenceValidation');

// POST /api/presence
router.post(
  '/',
  authMiddleware,
  validateBody(updatePresenceBody),
  presenceController.updatePresence
);

// GET /api/presence/:userId
router.get(
  '/:userId',
  authMiddleware,
  validateParams(userParamSchema),
  presenceController.getPresence
);

module.exports = router;