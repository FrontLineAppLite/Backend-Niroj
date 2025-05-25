// models/shift.request.js

const mongoose = require('mongoose');

const ShiftRequestSchema = new mongoose.Schema({
  // Who requested it
 // employee: {
 //   type: mongoose.Schema.Types.ObjectId,
  //  ref: 'User',
  //  required: true
 // },

  // Link back to an existing Shift (only for change‐requests)
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift'
  },

  // Title (used when creating a brand‐new shift)
  title: {
    type: String,
    required: function() {
      // only required on new‐shift requests
      return this.requestType === 'new';
    }
  },

  // Which kind of request
  requestType: {
    type: String,
    enum: ['new', 'change'],
    required: true
  },

  // Core shift data (date, times, type)
  shiftDate: {
    type: String,   // "YYYY-MM-DD"
    required: true
  },
  shiftStartTime: {
    type: String,   // "HH:mm"
    required: true
  },
  shiftEndTime: {
    type: String,   // "HH:mm"
    required: true
  },
  shiftType: {
    type: String,
    enum: ['4hr', '8hr'],
    required: true
  },

  // Who will work it
  assigned: {
    type: [String],
    default: []
  },

  // Optional notes/explanation
  notes: {
    type: String,
    default: ''
  },

  // Manager’s decision
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }

}, {
  timestamps: true  // adds createdAt & updatedAt automatically
});

module.exports = mongoose.model('ShiftRequest', ShiftRequestSchema);