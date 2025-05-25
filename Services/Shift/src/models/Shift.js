const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shiftType: { type: String, required: true },
    assigned: [{ type: String }], // Array to hold employee IDs or names
    notes: { type: String },
    // New fields for calendar view:
    shiftDate: { type: String, required: true },       // e.g., "2025-04-03"
    shiftStartTime: { type: String, required: true },    // e.g., "09:00"
    shiftEndTime: { type: String, required: true }       // e.g., "17:00"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shift', ShiftSchema);