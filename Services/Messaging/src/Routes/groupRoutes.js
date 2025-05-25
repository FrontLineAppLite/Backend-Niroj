// src/routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('@frontline/common').auth;
const {
  validateBody,
  validateParams
} = require('@frontline/common').validate;
const {
  createGroupSchema,
  sendGroupMessageSchema,
  addMemberSchema,
  removeMemberParamSchema,
  promoteMemberParamSchema
} = require('../validations/groupValidation');
const groupController = require('../controllers/groupController');

// ADD THIS route first:
router.get('/', authMiddleware, groupController.listAllGroups);

// CREATE GROUP
router.post(
  '/',
  authMiddleware,
  validateBody(createGroupSchema),
  groupController.createGroup
);

// SEND MESSAGE TO GROUP
router.post(
  '/:groupId/messages',
  authMiddleware,
  validateBody(sendGroupMessageSchema),
  groupController.sendGroupMessage
);

// GET GROUP MESSAGES
router.get(
  '/:groupId/messages',
  authMiddleware,
  groupController.getGroupMessages
);

// ADD MEMBER (Admins Only)
router.patch(
  '/:groupId/members/add',
  authMiddleware,
  validateBody(addMemberSchema),
  groupController.addMemberToGroup
);

// REMOVE MEMBER (Admins Only)
router.patch(
  '/:groupId/members/remove/:memberId',
  authMiddleware,
  validateParams(removeMemberParamSchema),
  groupController.removeMemberFromGroup
);

// PROMOTE MEMBER TO ADMIN (Admins Only)
router.patch(
  '/:groupId/members/promote/:memberId',
  authMiddleware,
  validateParams(promoteMemberParamSchema),
  groupController.promoteMemberToAdmin
);

// DELETE GROUP (Admins Only)
router.delete(
  '/:groupId',
  authMiddleware,
  groupController.deleteGroup
);

module.exports = router;