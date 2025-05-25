/**
 * Development helpers – these routes are *only* mounted when:
 *   BYPASS_AUTH=1   (already in your .env)  AND
 *   NODE_ENV !== 'production'
 *
 * POST /dev/seed   → clears + re-seeds Groups / Presence / Messages
 */
const router  = require('express').Router();
const { faker } = require('@faker-js/faker');      // lightweight data helper
const Message = require('../models/Message');
const Group   = require('../models/Group');
const Presence= require('../models/Presence');

const DEMO_USERS = ['alice', 'bob', 'carol', 'dave'];

router.post('/seed', async (_req, res, next) => {
  try {
    /* 1️⃣ wipe existing */
    await Promise.all([
      Message.deleteMany({}),
      Group.deleteMany({}),
      Presence.deleteMany({})
    ]);

    /* 2️⃣ presence */
    await Presence.insertMany(
      DEMO_USERS.map(u => ({
        user     : u,
        isOnline : Math.random() > 0.5,
        lastSeen : new Date()
      }))
    );

    /* 3️⃣ groups */
    const groups = await Group.insertMany([
      { name: 'General', description: 'Company-wide chat', members: DEMO_USERS, admins: ['alice'] },
      { name: 'Engineering', members: DEMO_USERS.slice(0,3), admins: ['bob'] }
    ]);

    /* 4️⃣ a few messages – one per user */
    await Message.insertMany(
      DEMO_USERS.map(u => ({
        sender : u,
        recipient: DEMO_USERS[0] === u ? DEMO_USERS[1] : DEMO_USERS[0],   // random DM
        content: faker.hacker.phrase(),
      }))
    );

    res.json({ ok:true, seeded:{ users:DEMO_USERS.length, groups:groups.length }});
  } catch (err) { next(err); }
});

module.exports = router;