const router = require('express').Router();
const { asyncWrapper } = require('@frontline/common').utils;
const auth             = require('@frontline/common').auth;

const {
  listShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift
} = require('../controllers/shiftController');

// All routes protected; drop `auth` if shifts should be public
router.get('/',       auth, asyncWrapper(listShifts));
router.get('/:id',    auth, asyncWrapper(getShiftById));
router.post('/',      auth, asyncWrapper(createShift));
router.put('/:id',    auth, asyncWrapper(updateShift));
router.delete('/:id', auth, asyncWrapper(deleteShift));

module.exports = router;