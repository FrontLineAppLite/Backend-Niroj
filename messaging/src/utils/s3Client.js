const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

const s3 = new AWS.S3({
  accessKeyId: config.s3.accessKey,
  secretAccessKey: config.s3.secretKey,
  region: config.s3.region
});

/**
 * Upload file to S3.
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>} - { fileName, fileUrl }
 */
exports.uploadToS3 = async (file) => {
  const fileKey = `${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: config.s3.bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  const uploadResult = await s3.upload(params).promise();
  return {
    fileName: fileKey,
    fileUrl: uploadResult.Location
  };
};

/**
 * Get a signed download URL
 * @param {string} fileName
 * @returns {Promise<string>} - Signed URL
 */
exports.getSignedUrl = async (fileName) => {
  const params = {
    Bucket: config.s3.bucketName,
    Key: fileName,
    Expires: 60 * 5 // 5 minutes
  };
  return s3.getSignedUrlPromise('getObject', params);
};