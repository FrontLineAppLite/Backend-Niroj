const Message = require('../models/Message');
const logger = require('../config/logger');

// Helper to throw an error with custom status code
function throwError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
}

exports.createDirectMessage = async (senderId, recipientId, content) => {
  // Potentially verify that sender != recipient, or that both exist
  // If there's an issue: throwError("Can't message self", 400);

  const newMessage = new Message({
    sender: senderId,
    recipient: recipientId,
    content
  });
  const savedMessage = await newMessage.save();
  logger.debug('Direct message created: %o', savedMessage);
  return savedMessage;
};

exports.fetchDirectMessages = async (userId, otherUserId) => {
  // You could verify user existence, or check relationships if needed
  return Message.find({
    $or: [
      { sender: userId, recipient: otherUserId },
      { sender: otherUserId, recipient: userId }
    ]
  }).sort({ createdAt: 1 });
};

exports.markAsRead = async (messageId, userId) => {
  const message = await Message.findById(messageId);
  if (!message) {
    throwError('Message not found', 404);
  }

  // Optionally verify user has permission to read this message
  // e.g., if user is neither the sender nor the recipient.
  if (
    message.recipient?.toString() !== userId &&
    message.sender?.toString() !== userId &&
    !message.group
  ) {
    throwError('Unauthorized to read this message', 403);
  }

  const alreadyRead = message.readBy.some((entry) => entry.user.toString() === userId);
  if (!alreadyRead) {
    message.readBy.push({ user: userId });
    await message.save();
  }
  return message;
};