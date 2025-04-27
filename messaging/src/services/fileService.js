const { uploadToS3, getSignedUrl } = require('../utils/s3Client');
const logger = require('../config/logger');

function throwError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
}

exports.uploadFile = async (file) => {
  // If there's a reason to reject certain file types, do it here
  // e.g., if (!allowedFileTypes.includes(file.mimetype)) { throwError('Unsupported file type', 400) }

  const uploadResult = await uploadToS3(file);
  logger.debug('File uploaded: %o', uploadResult);
  return uploadResult;
};

exports.getSignedUrl = async (fileName) => {
  // If you store a DB record of valid file names, you could verify existence
  // If not found, throwError('File not found', 404);

  const url = await getSignedUrl(fileName);
  return url;
};
