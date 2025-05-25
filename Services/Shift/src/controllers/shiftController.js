// ───────────────────────── Shift CRUD handlers ─────────────────────────
const Shift           = require('../models/Shift');
const createHttpError = require('http-errors');
const { logger }      = require('@frontline/config');

/**
 * GET /api/shifts
 */
exports.listShifts = async (_req, res) => {
  const shifts = await Shift.find().sort({ createdAt: -1 });
  res.json(shifts);
};

/**
 * GET /api/shifts/:id
 */
exports.getShiftById = async (req, res) => {
  const shift = await Shift.findById(req.params.id);
  if (!shift) throw createHttpError(404, 'Shift not found');
  res.json(shift);
};

/**
 * POST /api/shifts
 */
exports.createShift = async (req, res) => {
  const newShift = await Shift.create(req.body);
  logger.info('Shift created: %s', newShift._id);
  res.status(201).json(newShift);
};

/**
 * PUT /api/shifts/:id
 */
exports.updateShift = async (req, res) => {
  const updated = await Shift.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!updated) throw createHttpError(404, 'Shift not found');
  res.json(updated);
};

/**
 * DELETE /api/shifts/:id
 */
exports.deleteShift = async (req, res) => {
  const deleted = await Shift.findByIdAndDelete(req.params.id);
  if (!deleted) throw createHttpError(404, 'Shift not found');
  logger.warn('Shift deleted: %s', req.params.id);
  res.status(204).end();
};