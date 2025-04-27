const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateBody, validateParams } = require('../middlewares/validate');
const reactionController = require('../controllers/reactionController');
const {
  addReactionSchema,
  removeReactionParamSchema
} = require('../validations/reactionValidation');

// POST /api/reactions
router.post(
  '/',
  authMiddleware,
  validateBody(addReactionSchema),
  reactionController.addReaction
);

// DELETE /api/reactions/:reactionId
router.delete(
  '/:reactionId',
  authMiddleware,
  validateParams(removeReactionParamSchema),
  reactionController.removeReaction
);

module.exports = router;