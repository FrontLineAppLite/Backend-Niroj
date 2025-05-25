// services/messaging/src/routes/fileRoutes.js
const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const upload  = multer({ storage: multer.memoryStorage() });

const auth = require('@frontline/common').auth;          // shared middleware
router.use(auth);                                        // ← one line

const { validateBody, validateParams } = require('@frontline/common').validate;
const { uploadFileSchema, fileNameParamSchema } = require('../validations/fileValidation');
const fileController = require('../controllers/fileController');

// POST /api/files/upload
router.post(
  '/upload',
  upload.single('file'),
  validateBody(uploadFileSchema),
  fileController.uploadFile
);

// GET /api/files/download/:fileName
router.get(
  '/download/:fileName',
  validateParams(fileNameParamSchema),
  fileController.getFileDownloadLink
);

module.exports = router;