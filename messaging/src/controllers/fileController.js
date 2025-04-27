const fileService = require('../services/fileService');
const logger = require('../config/logger');

exports.uploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      // Immediately respond with a 400
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const uploadResult = await fileService.uploadFile(file);
    return res.status(200).json({ success: true, data: uploadResult });
  } catch (error) {
    logger.error('uploadFile error: %o', error);
    next(error);
  }
};

exports.getFileDownloadLink = async (req, res, next) => {
  try {
    const { fileName } = req.params;
    const signedUrl = await fileService.getSignedUrl(fileName);
    return res.json({ success: true, data: { signedUrl } });
  } catch (error) {
    logger.error('getFileDownloadLink error: %o', error);
    next(error);
  }
};