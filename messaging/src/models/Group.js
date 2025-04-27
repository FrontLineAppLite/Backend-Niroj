// src/models/Group.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: String }],
  admins: [{ type: String }]
}, { timestamps: true });

// Convert instance methods to simple string comparisons
groupSchema.methods.isAdmin = function (userId) {
  if (!this.admins) return false;
  return this.admins.includes(userId);
};
groupSchema.methods.isMember = function (userId) {
  if (!this.members) return false;
  return this.members.includes(userId);
};

module.exports = mongoose.model('Group', groupSchema);
