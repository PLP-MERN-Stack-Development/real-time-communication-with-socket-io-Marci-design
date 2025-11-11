// server/controllers/adminController.js
// Admin utilities: message deletion, kicking users (demo implementations)

function deleteMessage(stores, id) {
  const messages = stores.messages || [];
  const idx = messages.findIndex(m => m.id === id);
  if (idx === -1) return false;
  messages.splice(idx, 1);
  return true;
}

function kickUser(io, stores, socketId) {
  const socket = io.sockets.sockets.get(socketId);
  if (socket) {
    socket.disconnect(true);
    delete stores.users[socketId];
    return true;
  }
  return false;
}

module.exports = { deleteMessage, kickUser };
