// server/controllers/privateMessageController.js
// Handles private message creation/delivery (in-memory demo)

function sendPrivateMessage(stores, fromSocketId, { to, message }) {
  const users = stores.users || {};
  const messages = stores.messages || [];
  const msg = {
    id: Date.now(),
    sender: users[fromSocketId]?.username || 'Anonymous',
    senderId: fromSocketId,
    message,
    timestamp: new Date().toISOString(),
    isPrivate: true,
  };

  messages.push(msg);
  if (messages.length > 100) messages.shift();
  return msg;
}

module.exports = { sendPrivateMessage };
