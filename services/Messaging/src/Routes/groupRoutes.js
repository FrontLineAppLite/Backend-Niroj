// services/messaging/src/routes/groupRoutes.js
const express = require('express');
const router  = express.Router();

const auth = require('@frontline/common').auth;
router.use(auth);                       // ← protects everything below

const { validateBody, validateParams } = require('@frontline/common').validate;
const {
  createGroupSchema,
  sendGroupMessageSchema,
  addMemberSchema,
  removeMemberParamSchema,
  promoteMemberParamSchema
} = require('../validations/groupValidation');
const groupController = require('../controllers/groupController');

// LIST GROUPS
router.get('/', groupController.listAllGroups);

// CREATE GROUP
router.post('/', validateBody(createGroupSchema), groupController.createGroup);

// SEND MESSAGE TO GROUP
router.post('/:groupId/messages',
  validateBody(sendGroupMessageSchema),
  groupController.sendGroupMessage);

// GET GROUP MESSAGES
router.get('/:groupId/messages', groupController.getGroupMessages);

// ADD MEMBER (Admins Only)
router.patch('/:groupId/members/add',
  validateBody(addMemberSchema),
  groupController.addMemberToGroup);

// REMOVE MEMBER (Admins Only)
router.patch('/:groupId/members/remove/:memberId',
  validateParams(removeMemberParamSchema),
  groupController.removeMemberFromGroup);

// PROMOTE MEMBER TO ADMIN (Admins Only)
router.patch('/:groupId/members/promote/:memberId',
  validateParams(promoteMemberParamSchema),
  groupController.promoteMemberToAdmin);

// DELETE GROUP (Admins Only)
router.delete('/:groupId', groupController.deleteGroup);

module.exports = router;