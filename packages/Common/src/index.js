/**
 * Central export for @frontline/common
 */
module.exports = {
    /* middleware */
    auth         : require('./middleware/auth'),
    errorHandler : require('./middleware/errorHandler'),
    validate     : require('./middleware/validate'),
    upload       : require('./middleware/upload'),
  
    /* utils */
    s3Client     : require('./utils/s3Client'),
    asyncWrapper : require('./utils/asyncWrapper'),
  
    /* re-export every other util helper */
    ...require('./utils')
  };