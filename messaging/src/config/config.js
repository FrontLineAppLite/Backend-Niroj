require('dotenv').config();           // Loads .env in local dev; harmless in Docker

module.exports = {
  port: process.env.PORT || 4000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  logLevel: process.env.LOG_LEVEL || 'info',   //  ← KEEP THE COMMA here
  s3: {
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucketName: process.env.S3_BUCKET_NAME,
    region: process.env.AWS_REGION
  },
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://auth-service:3000'
};
