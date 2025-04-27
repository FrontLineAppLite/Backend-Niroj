const chatService = require('../services/chatService');
const logger = require('../config/logger');
const { getIO } = require('../socket');

exports.sendDirectMessage = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user.id;

    const message = await chatService.createDirectMessage(senderId, recipientId, content);

    // Emit socket event to room
    const io = getIO();
    const room = [senderId, recipientId].sort().join('_');
    io.to(room).emit('newDirectMessage', message);

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    logger.error('sendDirectMessage error: %o', error);
    next(error);
  }
};

exports.getDirectMessages = async (req, res, next) => {
  try {
    const { recipientId } = req.params;
    const userId = req.user.id;

    const messages = await chatService.fetchDirectMessages(userId, recipientId);
    return res.json({ success: true, data: messages });
  } catch (error) {
    logger.error('getDirectMessages error: %o', error);
    next(error);
  }
};

exports.markMessageAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const updatedMessage = await chatService.markAsRead(messageId, userId);
    return res.json({ success: true, data: updatedMessage });
  } catch (error) {
    logger.error('markMessageAsRead error: %o', error);
    next(error);
  }
};