const router = require('express').Router();
const { asyncWrapper } = require('@frontline/common').utils;
const auth            = require('@frontline/common').auth;

const {
  listAlerts,
  createAlert,
  deleteAlert
} = require('../controllers/alertController');

// GET all alerts
router.get('/', auth, asyncWrapper(listAlerts));

// POST create alert
router.post('/', auth, asyncWrapper(createAlert));

// DELETE alert
router.delete('/:id', auth, asyncWrapper(deleteAlert));

module.exports = router;