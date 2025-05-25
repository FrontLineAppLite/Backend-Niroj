/**
 * Controller for Task CRUD
 */
const Task            = require('../models/Task');
const { logger }      = require('@frontline/config');
const createHttpError = require('http-errors');          // optional: nicer errors

// GET /api/tasks
exports.getAllTasks = async (_req, res) => {
  const tasks = await Task.find().lean();
  res.json(tasks);
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).lean();
  if (!task) throw createHttpError(404, 'Task not found');
  res.json(task);
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  const newTask = await Task.create(req.body);
  logger.info(`Task created: ${newTask._id}`);
  res.status(201).json(newTask);
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const updated = await Task.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  }).lean();
  if (!updated) throw createHttpError(404, 'Task not found');
  res.json(updated);
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const deleted = await Task.findByIdAndDelete(id).lean();
  if (!deleted) throw createHttpError(404, 'Task not found');
  logger.warn(`Task deleted: ${id}`);
  res.status(204).end();
};

