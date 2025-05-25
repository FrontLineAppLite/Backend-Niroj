const express = require('express');
const router  = express.Router();

const auth = require('@frontline/common').auth;
router.use(auth);                                  // attach once

const { validateBody, validateParams } = require('@frontline/common').validate;
const {
  sendDirectMessageSchema,
  recipientParamSchema,
  messageParamSchema
} = require('../validations/chatValidation');
const chatController = require('../controllers/chatController');

// POST /api/chats/direct
router.post('/direct',
  validateBody(sendDirectMessageSchema),
  chatController.sendDirectMessage);

// GET /api/chats/direct/:recipientId
router.get('/direct/:recipientId',
  validateParams(recipientParamSchema),
  chatController.getDirectMessages);

// PATCH /api/chats/read/:messageId
router.patch('/read/:messageId',
  validateParams(messageParamSchema),
  chatController.markMessageAsRead);

// DEV placeholder
router.get('/direct/list', async (_req, res) => res.json([]));

module.exports = router;