const router         = require('express').Router();
const auth           = require('@frontline/common').auth;
const upload         = require('@frontline/common').upload;      // multer wrapper
const { asyncWrapper } = require('@frontline/common').utils;

const {
  listAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');

// GET /api/announcements
router.get('/', auth, asyncWrapper(listAnnouncements));

// POST /api/announcements       (field name "attachments")
router.post(
  '/',
  auth,
  upload.array('attachments', 5),
  asyncWrapper(createAnnouncement)
);

// PUT /api/announcements/:id    (field name "newAttachments")
router.put(
  '/:id',
  auth,
  upload.array('newAttachments', 5),
  asyncWrapper(updateAnnouncement)
);

// DELETE /api/announcements/:id
router.delete('/:id', auth, asyncWrapper(deleteAnnouncement));

module.exports = router;