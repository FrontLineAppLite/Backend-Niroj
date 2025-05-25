// src/validations/groupValidation.js
const Joi = require('joi');

exports.createGroupSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().allow(''),
  // now just strings, no regex
  members: Joi.array().items(Joi.string()),
  admins: Joi.array().items(Joi.string())
});

exports.sendGroupMessageSchema = Joi.object({
  content: Joi.string().max(5000).allow('')
});

exports.addMemberSchema = Joi.object({
  newMemberId: Joi.string().required()
});

exports.removeMemberParamSchema = Joi.object({
  groupId: Joi.string().required(),
  memberId: Joi.string().required()
});

exports.promoteMemberParamSchema = Joi.object({
  groupId: Joi.string().required(),
  memberId: Joi.string().required()
});