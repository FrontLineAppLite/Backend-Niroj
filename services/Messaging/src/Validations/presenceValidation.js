// src/validations/presenceValidation.js
const Joi = require('joi');

exports.updatePresenceBody = Joi.object({
  isOnline: Joi.boolean().required()
});

exports.userParamSchema = Joi.object({
  userId: Joi.string().required()
});