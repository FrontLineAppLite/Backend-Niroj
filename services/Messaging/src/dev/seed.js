/**
 * Dev-only seeder.  Creates…
 *   • 3 demo users (presence records)
 *   • 1 group          “Nurses – Chicago Ward”
 *   • 4 direct messages between “devUser” and “alice”
 *   • 2 group messages
 *
 * Run once on container start via /dev/seed route (see below).
 */
const Presence = require('../models/Presence');
const Group    = require('../models/Group');
const Message  = require('../models/Message');
const logger   = require('@frontline/config').logger;

module.exports = async function seedDev() {
  /* ─── contacts / presence ───────────── */
  const users = ['devUser', 'alice', 'bob'];
  for (const u of users) {
    await Presence.updateOne(
      { user: u },
      { isOnline: true, lastSeen: null },
      { upsert: true }
    );
  }

  /* ─── one group ─────────────────────── */
  const group = await Group.findOneAndUpdate(
    { name: 'Nurses – Chicago Ward' },
    {
      description: 'Shift hand-off & announcements',
      members : users,
      admins  : ['devUser']
    },
    { upsert: true, new: true }
  );

  /* ─── some messages ─────────────────── */
  const msgs = [
    /* direct */
    { sender:'devUser', recipient:'alice', content:'Hi Alice – welcome on board!' },
    { sender:'alice',   recipient:'devUser', content:'Thanks! Glad to be here' },
    { sender:'devUser', recipient:'alice', content:'Ping me if you need anything.' },
    { sender:'alice',   recipient:'devUser', content:'Will do' },

    /* group */
    { sender:'bob',  group:group._id, content:'Morning team, remember CPR drills at 10.' },
    { sender:'alice',group:group._id, content:'Got it, thanks for the heads-up.' }
  ];

  await Message.insertMany(msgs.map(m => ({ ...m, createdAt:new Date() })));

  logger.info('[DEV-SEED] Demo data ready ✔');
}