// src/models/Presence.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const presenceSchema = new Schema({
  user: { type: String, unique: true },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Presence', presenceSchema);