// src/validations/reactionValidation.js
const Joi = require('joi');

exports.addReactionSchema = Joi.object({
  messageId: Joi.string().required(),
  emoji: Joi.string().max(10).required()
});

exports.removeReactionParamSchema = Joi.object({
  reactionId: Joi.string().required()
});