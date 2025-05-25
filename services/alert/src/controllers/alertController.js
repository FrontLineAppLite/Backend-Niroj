// services/alert/src/controllers/alertController.js
// ───────────────────────────────────────────────────────────────
// CRUD handlers for the Alert micro‑service
// • listAlerts   – GET  /api/alerts           (all alerts, newest first)
// • createAlert  – POST /api/alerts           (title, message, users)
// • deleteAlert  – DELETE /api/alerts/:id     (remove one alert)
// ───────────────────────────────────────────────────────────────
const Alert            = require('../models/Alert');
const { logger }       = require('@frontline/config');
const createHttpError  = require('http-errors');        // nicer 4xx/5xx errors

/**
 * GET  /api/alerts
 */
exports.listAlerts = async (_req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.json(alerts);
};

/**
 * POST /api/alerts
 * Expected body: { title, message, users }
 */
exports.createAlert = async (req, res) => {
  const { title, message, users } = req.body;

  if (!title || !message) throw createHttpError(400, 'title & message required');

  const newAlert = await Alert.create({ title, message, users });
  logger.debug('Alert created: %o', newAlert);
  res.status(201).json(newAlert);
};

/**
 * DELETE /api/alerts/:id
 */
exports.deleteAlert = async (req, res) => {
  const deleted = await Alert.findByIdAndDelete(req.params.id);
  if (!deleted) throw createHttpError(404, 'Alert not found');
  res.status(204).end();
};