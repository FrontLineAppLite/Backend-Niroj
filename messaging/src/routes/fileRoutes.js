const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const authMiddleware = require('../middlewares/authMiddleware');
const { validateBody, validateParams } = require('../middlewares/validate');
const { uploadFileSchema, fileNameParamSchema } = require('../validations/fileValidation');
const fileController = require('../controllers/fileController');

// POST /api/files/upload
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),            // handle the file
  validateBody(uploadFileSchema),   // validate optional body fields
  fileController.uploadFile
);

// GET /api/files/download/:fileName
router.get(
  '/download/:fileName',
  authMiddleware,
  validateParams(fileNameParamSchema),
  fileController.getFileDownloadLink
);

module.exports = router;
