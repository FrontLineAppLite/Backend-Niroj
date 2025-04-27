const logger = require('./config/logger');
const chatService = require('./services/chatService');
const presenceService = require('./services/presenceService');
const groupService = require('./services/groupService');

let ioInstance; // <- Add this to hold the Socket.IO instance

function setupSocketIO(io) {
  ioInstance = io; // <- Save reference so other modules (controllers) can use it

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join direct chat room
    socket.on('joinDirectChat', ({ userId, otherUserId }) => {
      const room = generateRoomName(userId, otherUserId);
      socket.join(room);
      logger.info(`Socket ${socket.id} joined DM room: ${room}`);
    });

    // Leave direct chat room (optional)
    socket.on('leaveDirectChat', ({ room }) => {
      socket.leave(room);
      logger.info(`Socket ${socket.id} left DM room: ${room}`);
    });

    // Join group room
    socket.on('joinGroupChat', ({ groupId }) => {
      socket.join(`group_${groupId}`);
      logger.info(`Socket ${socket.id} joined group room: group_${groupId}`);
    });

    // Send direct message via socket
    socket.on('sendDirectMessage', async ({ senderId, recipientId, content }) => {
      try {
        const message = await chatService.createDirectMessage(senderId, recipientId, content);
        const room = generateRoomName(senderId, recipientId);
        io.to(room).emit('newDirectMessage', message);
      } catch (err) {
        logger.error('Error sending direct message: %o', err);
        socket.emit('errorMessage', { error: err.message });
      }
    });

    // Send group message via socket
    socket.on('sendGroupMessage', async ({ senderId, groupId, content }) => {
      try {
        const message = await groupService.sendMessageToGroup(senderId, groupId, content);
        io.to(`group_${groupId}`).emit('newGroupMessage', message);
      } catch (err) {
        logger.error('Error sending group message: %o', err);
        socket.emit('errorMessage', { error: err.message });
      }
    });

    // Handle presence
    socket.on('updatePresence', async ({ userId, isOnline }) => {
      try {
        const presence = await presenceService.updateUserPresence(userId, isOnline);
        io.emit('presenceUpdated', presence);
      } catch (err) {
        logger.error('Error updating presence: %o', err);
        socket.emit('errorMessage', { error: err.message });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
}

/**
 * Utility to consistently generate room names
 */
function generateRoomName(userA, userB) {
  return [userA, userB].sort().join('_');
}

/**
 * Export the active Socket.IO instance
 */
function getIO() {
  return ioInstance;
}

module.exports = {
  setupSocketIO,
  getIO,
};