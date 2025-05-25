/**
 * Task routes
 * Base path: /api/tasks   (mounted from src/index.js)
 */
const router = require('express').Router();

const { asyncWrapper } = require('@frontline/common').utils;
const auth = require('@frontline/common').auth;

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// ───────────────────────────── REST Endpoints ────────────────────────────── //
// Every handler is wrapped with asyncWrapper so any thrown error is passed to
// your global errorHandler automatically.

router.get(
  '/',
  auth,
  asyncWrapper(getAllTasks)
  );
  
  router.get(
    '/:id',
    auth,
    asyncWrapper(getTaskById)
  );
  
  router.post(
    '/',
    auth,
    asyncWrapper(createTask)
  );
  
  router.put(
    '/:id',
    auth,
    asyncWrapper(updateTask)
  );
  
  router.delete(
    '/:id',
    auth,
    asyncWrapper(deleteTask)
  );
  
  module.exports = router;  