// src/validations/chatValidation.js
const Joi = require('joi');

exports.sendDirectMessageSchema = Joi.object({
  recipientId: Joi.string().required(),
  content: Joi.string().max(5000).allow('')
});

exports.recipientParamSchema = Joi.object({
  recipientId: Joi.string().required()
});

exports.messageParamSchema = Joi.object({
  messageId: Joi.string().required()
});