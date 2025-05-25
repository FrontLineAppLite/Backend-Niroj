const router = require('express').Router();
const { asyncWrapper } = require('@frontline/common').utils;
const auth             = require('@frontline/common').auth;

const {
  listRequests,
  createRequest,
  approveRequest,
  rejectRequest
} = require('../controllers/shiftRequestController');

router.get('/',            auth, asyncWrapper(listRequests));
router.post('/',           auth, asyncWrapper(createRequest));
router.put('/:id/approve', auth, asyncWrapper(approveRequest));
router.put('/:id/reject',  auth, asyncWrapper(rejectRequest));

module.exports = router;