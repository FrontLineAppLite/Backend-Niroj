const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const uploadDir =
  process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename   : (_req, file, cb)  => cb(null, `${Date.now()}_${file.originalname}`)
});

module.exports = multer({ storage });