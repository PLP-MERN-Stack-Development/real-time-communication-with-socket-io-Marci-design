// server/controllers/typingController.js
// Manage typing users state (in-memory helper)

function setTyping(stores, socketId, username, isTyping) {
  const typingUsers = stores.typingUsers || {};
  if (isTyping) typingUsers[socketId] = username;
  else delete typingUsers[socketId];
  return Object.values(typingUsers);
}

module.exports = { setTyping };
