const presenceService = require('../services/presenceService');
const logger = require('@frontline/config').logger;

// Update user's presence
exports.updatePresence = async (req, res, next) => {
  try {
    const userId = req.user.id;  // user from JWT
    const { isOnline } = req.body;

    const updatedPresence = await presenceService.updateUserPresence(userId, isOnline);
    return res.json({ success: true, data: updatedPresence });
  } catch (error) {
    logger.error('updatePresence error: %o', error);
    next(error);
  }
};

// Retrieve a user's presence
exports.getPresence = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const presence = await presenceService.getUserPresence(userId);
    return res.json({ success: true, data: presence });
  } catch (error) {
    logger.error('getPresence error: %o', error);
    next(error);
  }
};