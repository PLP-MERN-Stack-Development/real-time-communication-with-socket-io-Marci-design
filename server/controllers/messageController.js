// server/controllers/messageController.js
// Message controller with Mongoose Message model integration

const Message = require('../models/Message');

async function createMessage(data, senderId, senderName) {
  try {
    const message = new Message({
      text: data.text,
      sender: senderId,
      senderName,
      room: data.room || null,
      recipients: data.recipients || [],
      isPrivate: data.isPrivate || false,
      attachments: data.attachments || [],
    });
    await message.save();
    return message;
  } catch (err) {
    console.error('Create message error:', err);
    throw err;
  }
}

async function listMessages({ limit = 50, room = null, isPrivate = false } = {}) {
  try {
    const query = { deletedAt: null };
    if (room) query.room = room;
    if (isPrivate) query.isPrivate = true;

    const messages = await Message.find(query)
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
    return messages.reverse();
  } catch (err) {
    console.error('List messages error:', err);
    throw err;
  }
}

async function deleteMessage(messageId) {
  try {
    await Message.updateOne({ _id: messageId }, { deletedAt: new Date() });
    return true;
  } catch (err) {
    console.error('Delete message error:', err);
    throw err;
  }
}

module.exports = { createMessage, listMessages, deleteMessage };
