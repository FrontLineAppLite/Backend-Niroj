const express = require('express');
const router = express.Router();

const tasks = []; // In-memory store for now

// POST /api/tasks
router.post('/', (req, res) => {
  const task = req.body;
  tasks.push(task);
  res.status(201).json({ message: 'Task created', task });
});

// GET /api/tasks
router.get('/', (req, res) => {
  res.status(200).json(tasks);
});

module.exports = router;

