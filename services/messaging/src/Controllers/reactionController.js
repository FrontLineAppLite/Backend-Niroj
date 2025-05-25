const reactionService = require('../services/reactionService');
const logger = require('@frontline/config').logger;

exports.addReaction = async (req, res, next) => {
  try {
    const { messageId, emoji } = req.body;
    const userId = req.user.id;

    const reaction = await reactionService.addReaction(messageId, userId, emoji);
    return res.status(201).json({ success: true, data: reaction });
  } catch (error) {
    logger.error('addReaction error: %o', error);
    next(error);
  }
};

exports.removeReaction = async (req, res, next) => {
  try {
    const { reactionId } = req.params;
    const userId = req.user.id;

    await reactionService.removeReaction(reactionId, userId);
    return res.json({ success: true, message: 'Reaction removed' });
  } catch (error) {
    logger.error('removeReaction error: %o', error);
    next(error);
  }
};