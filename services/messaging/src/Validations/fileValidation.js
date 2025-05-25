const Joi = require('joi');

// Body validation for file upload (if needed)
// You can leave this empty if no additional metadata is required.
exports.uploadFileSchema = Joi.object({});

// Param validation for download route
exports.fileNameParamSchema = Joi.object({
  fileName: Joi.string().required()
});