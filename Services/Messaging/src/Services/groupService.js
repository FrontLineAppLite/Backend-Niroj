const Group = require('../models/Group');
const Message = require('../models/Message');
const logger = require('@frontline/config').logger;

/**
 * Helper to throw an error with a custom status code
 */
function throwError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
}

exports.getAllGroups = async () => {
  return Group.find({}).sort({ createdAt: 1 });
};

exports.createGroup = async (name, members = [], admins = [], description) => {
  const group = new Group({ name, description, members, admins });
  const savedGroup = await group.save();
  logger.debug('Group created: %o', savedGroup);
  return savedGroup;
};

exports.sendMessageToGroup = async (senderId, groupId, content) => {
  const group = await Group.findById(groupId);
  if (!group) throwError('Group not found', 404);

  // Make sure the sender is a member or admin
  if (!group.isMember(senderId) && !group.isAdmin(senderId)) {
    throwError('Unauthorized: Sender is not in the group', 403);
  }

  const message = new Message({
    sender: senderId,
    group: groupId,
    content
  });
  const savedMessage = await message.save();
  return savedMessage;
};

exports.getGroupMessages = async (groupId) => {
  // We assume the group must exist, but if you need to check membership,
  // you'd fetch the group first. For now, we simply return messages.
  return Message.find({ group: groupId }).sort({ createdAt: 1 });
};

/**
 * Add a member to the group (Admins only)
 */
exports.addMember = async (groupId, newMemberId, requestingUserId) => {
  const group = await Group.findById(groupId);
  if (!group) throwError('Group not found', 404);

  // Only admins can add new members
  if (!group.isAdmin(requestingUserId)) {
    throwError('Unauthorized: Only admins can add members', 403);
  }

  if (!group.isMember(newMemberId)) {
    group.members.push(newMemberId);
    await group.save();
    logger.debug('Member added to group: %o', group);
  }
  return group;
};

/**
 * Remove a member from the group (Admins only)
 */
exports.removeMember = async (groupId, memberId, requestingUserId) => {
  const group = await Group.findById(groupId);
  if (!group) throwError('Group not found', 404);

  // Only admins can remove members
  if (!group.isAdmin(requestingUserId)) {
    throwError('Unauthorized: Only admins can remove members', 403);
  }

  // Ensure the member is actually in the group
  if (!group.isMember(memberId)) {
    throwError('User to remove is not in the group', 400);
  }

  // Remove from members
  group.members = group.members.filter((mId) => mId !== memberId);

  // If the user was also an admin, remove them from admins
  if (group.isAdmin(memberId)) {
    group.admins = group.admins.filter((aId) => aId !== memberId);
  }

  await group.save();
  logger.debug('Member removed from group: %o', group);
  return group;
};

/**
 * Promote a member to admin (Admins only)
 */
exports.promoteMemberToAdmin = async (groupId, memberId, requestingUserId) => {
  const group = await Group.findById(groupId);
  if (!group) throwError('Group not found', 404);

  // Only existing admins can promote others
  if (!group.isAdmin(requestingUserId)) {
    throwError('Unauthorized: Only admins can promote members', 403);
  }

  // The user to promote must already be a member
  if (!group.isMember(memberId)) {
    throwError('User to promote is not in the group', 400);
  }

  // If they're already an admin, do nothing
  if (!group.isAdmin(memberId)) {
    group.admins.push(memberId);
    await group.save();
    logger.debug('Member promoted to admin: %o', group);
  }
  return group;
};

exports.findGroupById = async (id) => {
  return Group.findById(id);
};

// Remove the group doc and all its messages if you want
exports.deleteGroupAndMessages = async (groupId) => {
  // optional: remove the group
  await Group.findByIdAndDelete(groupId);
  // optional: also remove messages for that group
  await Message.deleteMany({ group: groupId });
};