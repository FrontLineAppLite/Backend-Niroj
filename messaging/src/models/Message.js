// src/models/Message.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: String, required: true },
  recipient: { type: String },
  group: { type: String },
  content: { type: String, default: '' },
  attachments: [
    {
      fileName: String,
      fileUrl: String,
      fileType: String
    }
  ],
  readBy: [
    {
      user: String,
      readAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);