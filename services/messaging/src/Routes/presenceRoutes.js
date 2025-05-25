const express = require('express');
const router  = express.Router();

const auth = require('@frontline/common').auth;
router.use(auth);

const { validateBody, validateParams } = require('@frontline/common').validate;
const presenceController = require('../controllers/presenceController');
const { updatePresenceBody, userParamSchema } = require('../validations/presenceValidation');

// POST /api/presence
router.post('/', validateBody(updatePresenceBody), presenceController.updatePresence);

// GET /api/presence/:userId
router.get('/:userId', validateParams(userParamSchema), presenceController.getPresence);

// DEV helper: list all presences (still protected by router.use)
router.get('/all', async (_req, res) => {
  const Presence = require('../models/Presence');
  const list = await Presence.find({});
  res.json(list);
});

module.exports = router;