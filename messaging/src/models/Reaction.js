// src/models/Reaction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
  messageId: { type: String, required: true },
  user: { type: String, required: true },
  emoji: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Reaction', reactionSchema);