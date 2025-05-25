// services/messaging/src/routes/devPreviewRoutes.js
const router   = require('express').Router();
const Message  = require('../models/Message');

/**
 * GET /api/chats/direct/list
 * Returns one “preview” row per peer the current user has DMed with.
 * For the demo we ignore auth and just list ALL previews.
 */
router.get('/api/chats/direct/list', async (_req, res, next) => {
  try {
    /**
     * We no longer try to decide who is “me”.
     * Every distinct pair of sender/recipient becomes one row, regardless of
     * which side sent the last message.
     */
    const previews = await Message.aggregate([
        { $match: { recipient: { $ne: null } } },            // keep DMs
        { $sort: { createdAt: -1 } },                        // newest first
  
        // Build a canonical conversation id so A↔B and B↔A are the same group
        { $addFields: {
            pairId: {
              $cond: [
                { $gt: ['$sender', '$recipient'] },
                { $concat: ['$sender', '_', '$recipient'] }, // sender bigger
                { $concat: ['$recipient', '_', '$sender'] }  // recipient bigger
              ]
            }
          }
        },
  
        { $group: {
            _id: '$pairId',
            lastMessage: { $first: '$content' },
            lastSender : { $first: '$sender'    },
            lastRecip  : { $first: '$recipient' }
        }},
  
        /* For the demo we expose both participants so the client can decide
           which one is the “other” user. */
        { $project: {
            _id         : 0,
            users       : ['$$ROOT.lastSender', '$$ROOT.lastRecip'],
            lastMessage : 1
        }}
      ]);
    res.json(previews);
  } catch (err) { next(err); }
});

module.exports = router;