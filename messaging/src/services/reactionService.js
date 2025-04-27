const Reaction = require('../models/Reaction');
const Message = require('../models/Message');
const logger = require('../config/logger');

function throwError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
}

exports.addReaction = async (messageId, userId, emoji) => {
  // Optionally check if messageId is valid or if user can see the message:
  const message = await Message.findById(messageId);
  if (!message) {
    throwError('Message not found', 404);
  }
  // For example, if it's a direct message, ensure user is the sender or recipient
  // if (message.recipient.toString() !== userId && message.sender.toString() !== userId) throwError('Unauthorized', 403);

  const newReaction = new Reaction({
    messageId,
    user: userId,
    emoji
  });
  const savedReaction = await newReaction.save();
  logger.debug('Reaction added: %o', savedReaction);
  return savedReaction;
};

exports.removeReaction = async (reactionId, userId) => {
  const reaction = await Reaction.findById(reactionId);
  if (!reaction) {
    throwError('Reaction not found', 404);
  }

  // Ensure only the user who posted the reaction can remove it
  if (reaction.user.toString() !== userId) {
    throwError('Unauthorized to remove this reaction', 403);
  }

  await Reaction.findByIdAndDelete(reactionId);
  logger.debug('Reaction removed: %s', reactionId);
  return;
};