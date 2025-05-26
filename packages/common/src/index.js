/**
 * Central export for @frontline/common
 */
module.exports = {
  /* middleware */
  auth         : require('./middleware/auth'),
  errorHandler : require('./middleware/errorHandler'),
  validate     : require('./middleware/validate'),
  upload       : require('./middleware/upload'),
  bypassAuthIf : require('./bypassAuthIf'),

  /* utils */
  s3Client     : require('./utils/s3Client'),
  asyncWrapper : require('./utils/asyncWrapper'),
  tokenUtils   : require('./utils/tokenUtils'),

  /* keep any other helpers automatically re-exported */
  ...require('./utils'),
};