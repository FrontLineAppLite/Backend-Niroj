// src/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  authProviderId: { type: String, unique: true },
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  status: { type: String, default: 'active' },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }], // array of roles
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);