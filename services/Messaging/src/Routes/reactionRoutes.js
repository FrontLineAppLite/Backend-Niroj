const express = require('express');
const router  = express.Router();

const auth = require('@frontline/common').auth;
router.use(auth);

const { validateBody, validateParams } = require('@frontline/common').validate;
const reactionController = require('../controllers/reactionController');
const { addReactionSchema, removeReactionParamSchema } = require('../validations/reactionValidation');

// POST /api/reactions
router.post('/', validateBody(addReactionSchema), reactionController.addReaction);

// DELETE /api/reactions/:reactionId
router.delete('/:reactionId',
  validateParams(removeReactionParamSchema),
  reactionController.removeReaction
);

module.exports = router;