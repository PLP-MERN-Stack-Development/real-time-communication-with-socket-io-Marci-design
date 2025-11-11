// server/controllers/presenceController.js
// Presence utilities to manage online users

function addUser(stores, socketId, username) {
  const users = stores.users || (stores.users = {});
  users[socketId] = { id: socketId, username };
  return Object.values(users);
}

function removeUser(stores, socketId) {
  const users = stores.users || {};
  delete users[socketId];
  return Object.values(users);
}

module.exports = { addUser, removeUser };
