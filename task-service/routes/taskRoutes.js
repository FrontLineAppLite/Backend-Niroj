// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { createTask, getAllTasks } = require('../controllers/taskController');

router.post('/tasks', createTask);
router.get('/tasks', getAllTasks);

module.exports = router;

