// scripts/deleteAllGroups.js

const mongoose = require('mongoose');
const config = require('../src/config/config');
const Group = require('../src/models/Group');
const Message = require('../src/models/Message');

async function deleteAllGroups() {
  await mongoose.connect(config.mongoURI);
  console.log('Connected to MongoDB');

  const groups = await Group.find({});
  console.log(`Deleting ${groups.length} groups...`);

  for (let group of groups) {
    await Message.deleteMany({ group: group._id });
    await Group.deleteOne({ _id: group._id });
    console.log(`Deleted group ${group.name}`);
  }

  console.log('✅ All groups and their messages deleted.');
  process.exit(0);
}

deleteAllGroups().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});