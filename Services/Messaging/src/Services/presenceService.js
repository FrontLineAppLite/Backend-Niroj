const Presence = require('../models/Presence');
const logger = require('@frontline/config').logger;

function throwError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
}

exports.updateUserPresence = async (userId, isOnline) => {
  // If user must exist in an Auth service, you could check that here or trust JWT
  // If you want to disallow presence changes for other users, compare userId in JWT to param

  const presenceData = {
    user: userId,
    isOnline,
    lastSeen: isOnline ? null : new Date()
  };

  const presence = await Presence.findOneAndUpdate(
    { user: userId },
    presenceData,
    { upsert: true, new: true }
  );
  logger.debug('Presence updated: %o', presence);
  return presence;
};

exports.getUserPresence = async (userId) => {
  const presence = await Presence.findOne({ user: userId });
  if (!presence) {
    // Optionally throw a 404 if you want to treat "no presence record" as missing user
    // throwError(`Presence not found for user ${userId}`, 404);
    return { user: userId, isOnline: false, lastSeen: null };
  }
  return presence;
};
