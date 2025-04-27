const groupService = require('../services/groupService');
const logger = require('../config/logger');

exports.createGroup = async (req, res, next) => {
  try {
    const { name, members = [], admins = [], description } = req.body;
    const creatorId = req.user.id;
    
    // Ensure the creator is in both arrays
    const updatedMembers = Array.from(new Set([...members, creatorId]));
    const updatedAdmins = Array.from(new Set([...admins, creatorId]));
    
    const group = await groupService.createGroup(name, updatedMembers, updatedAdmins, description);
    return res.status(201).json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
};

const { getIO } = require('../socket'); // make sure this is imported at the top

exports.sendGroupMessage = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    const message = await groupService.sendMessageToGroup(senderId, groupId, content);

    // EMIT to socket group room
    const io = getIO();
    io.to(`group_${groupId}`).emit('newGroupMessage', message);

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    logger.error('sendGroupMessage error: %o', error);
    next(error);
  }
};

exports.getGroupMessages = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const messages = await groupService.getGroupMessages(groupId);
    return res.json({ success: true, data: messages });
  } catch (error) {
    logger.error('getGroupMessages error: %o', error);
    next(error);
  }
};

exports.addMemberToGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { newMemberId } = req.body;
    const requestingUserId = req.user.id;

    const updatedGroup = await groupService.addMember(groupId, newMemberId, requestingUserId);
    return res.json({ success: true, data: updatedGroup });
  } catch (error) {
    logger.error('addMemberToGroup error: %o', error);
    next(error);
  }
};

exports.removeMemberFromGroup = async (req, res, next) => {
  try {
    const { groupId, memberId } = req.params;
    const requestingUserId = req.user.id;

    const updatedGroup = await groupService.removeMember(groupId, memberId, requestingUserId);
    return res.json({ success: true, data: updatedGroup });
  } catch (error) {
    logger.error('removeMemberFromGroup error: %o', error);
    next(error);
  }
};

exports.promoteMemberToAdmin = async (req, res, next) => {
  try {
    const { groupId, memberId } = req.params;
    const requestingUserId = req.user.id;

    const updatedGroup = await groupService.promoteMemberToAdmin(
      groupId,
      memberId,
      requestingUserId
    );
    return res.json({ success: true, data: updatedGroup });
  } catch (error) {
    logger.error('promoteMemberToAdmin error: %o', error);
    next(error);
  }
};

exports.listAllGroups = async (req, res, next) => {
  try {
    // Return all groups
    const groups = await groupService.getAllGroups();
    return res.json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
};

exports.deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const requestingUserId = req.user.id;
    
    const group = await groupService.findGroupById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }
    if (!group.isAdmin(requestingUserId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Only admins can delete groups' });
    }
    await groupService.deleteGroupAndMessages(groupId);
    return res.json({ success: true, message: 'Group deleted' });
  } catch (err) {
    next(err);
  }
};