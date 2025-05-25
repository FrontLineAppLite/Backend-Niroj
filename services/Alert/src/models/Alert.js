const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    users: { type: String, required: true }, // simple string for now; update later to support real user references
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', AlertSchema);