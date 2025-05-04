const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateBody,
  validateParams
} = require('../middlewares/validate');
const {
  sendDirectMessageSchema,
  recipientParamSchema,
  messageParamSchema
} = require('../validations/chatValidation');
const chatController = require('../controllers/chatController');

// POST /api/chats/direct
router.post(
  '/direct',
  authMiddleware,
  validateBody(sendDirectMessageSchema),
  chatController.sendDirectMessage
);

// GET /api/chats/direct/:recipientId
router.get(
  '/direct/:recipientId',
  authMiddleware,
  validateParams(recipientParamSchema),
  chatController.getDirectMessages
);

// PATCH /api/chats/read/:messageId
router.patch(
  '/read/:messageId',
  authMiddleware,
  validateParams(messageParamSchema),
  chatController.markMessageAsRead
);

router.get(
  '/direct/list',
  authMiddleware,
  async (req, res) => {
    res.json([]);              // TODO: build real preview query
  }
);
module.exports = router;