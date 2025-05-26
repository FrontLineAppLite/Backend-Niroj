const express = require('express');
const router  = express.Router();

const { auth, bypassAuthIf, validate } = require('@frontline/common');
const { validateBody, validateParams } = validate;

const presenceController = require('../controllers/presenceController');
const { updatePresenceBody, userParamSchema } = require('../validations/presenceValidation');

/* Skip JWT when BYPASS_AUTH=1 */
router.use(bypassAuthIf(process.env.BYPASS_AUTH==='1', auth));

/* ───── DEV helper: list all presences ───── */
router.get('/all', async (_req, res) => {
  const Presence = require('../models/Presence');
  res.json(await Presence.find({}));
});

/* ───── Authenticated routes ───── */
/* POST /api/presence */
router.post('/', validateBody(updatePresenceBody), presenceController.updatePresence);

/* GET /api/presence/:userId */
router.get('/:userId', validateParams(userParamSchema), presenceController.getPresence);

module.exports = router;