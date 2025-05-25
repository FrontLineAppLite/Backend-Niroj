const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const {
  S3_ACCESS_KEY,
  S3_SECRET_KEY,
  S3_BUCKET_NAME,
  AWS_REGION
} = process.env;

const s3 = new AWS.S3({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET_KEY,
  region: AWS_REGION
});

exports.uploadToS3 = async (file) => {
  const fileKey = `${uuidv4()}-${file.originalname}`;
  const uploadResult = await s3
    .upload({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype
    })
    .promise();
  return { fileName: fileKey, fileUrl: uploadResult.Location };
};

exports.getSignedUrl = async (fileName) => {
  return s3.getSignedUrlPromise('getObject', {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Expires: 5 * 60
  });
};