// ─────────────────── Shift‑Request handlers (new / change) ─────────────
const ShiftRequest    = require('../models/ShiftRequest');
const Shift           = require('../models/Shift');
const createHttpError = require('http-errors');

/**
 * GET /api/shiftRequests
 */
exports.listRequests = async (_req, res) => {
  const reqs = await ShiftRequest.find().populate('shiftId');
  res.json(reqs);
};

/**
 * POST /api/shiftRequests
 */
exports.createRequest = async (req, res) => {
  const sr = await ShiftRequest.create(req.body);
  res.status(201).json(sr);
};

/**
 * PUT /api/shiftRequests/:id/approve
 */
exports.approveRequest = async (req, res) => {
  const sr = await ShiftRequest.findById(req.params.id);
  if (!sr) throw createHttpError(404, 'ShiftRequest not found');

  sr.status = 'approved';
  await sr.save();

  if (sr.requestType === 'change' && sr.shiftId) {
    // update existing shift
    await Shift.findByIdAndUpdate(sr.shiftId, {
      title          : sr.title,
      shiftType      : sr.shiftType,
      assigned       : sr.assigned,
      notes          : sr.notes,
      shiftDate      : sr.shiftDate,
      shiftStartTime : sr.shiftStartTime,
      shiftEndTime   : sr.shiftEndTime
    });
  } else if (sr.requestType === 'new') {
    // create a new shift
    await Shift.create({
      title          : sr.title,
      shiftType      : sr.shiftType,
      assigned       : sr.assigned,
      notes          : sr.notes,
      shiftDate      : sr.shiftDate,
      shiftStartTime : sr.shiftStartTime,
      shiftEndTime   : sr.shiftEndTime
    });
  }

  res.json(sr);
};

/**
 * PUT /api/shiftRequests/:id/reject
 */
exports.rejectRequest = async (req, res) => {
  const sr = await ShiftRequest.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  );
  if (!sr) throw createHttpError(404, 'ShiftRequest not found');
  res.json(sr);
};