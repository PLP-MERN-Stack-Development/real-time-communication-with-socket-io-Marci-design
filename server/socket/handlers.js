// server/socket/handlers.js
// Centralized Socket.IO event handlers. Receives the `io` instance and shared stores.

module.exports = function(io, stores = {}) {
  const { users = {}, messages = [], typingUsers = {} } = stores;

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining
    socket.on('user_join', (username) => {
      users[socket.id] = { username, id: socket.id };
      io.emit('user_list', Object.values(users));
      io.emit('user_joined', { username, id: socket.id });
      console.log(`${username} joined the chat`);
    });

    // Handle chat messages
    socket.on('send_message', (messageData) => {
      const message = {
        ...messageData,
        id: Date.now(),
        sender: users[socket.id]?.username || 'Anonymous',
        senderId: socket.id,
        timestamp: new Date().toISOString(),
      };

      messages.push(message);

      // Limit stored messages to prevent memory issues
      if (messages.length > 100) {
        messages.shift();
      }

      io.emit('receive_message', message);
    });

    // Handle typing indicator
    socket.on('typing', (isTyping) => {
      if (users[socket.id]) {
        const username = users[socket.id].username;

        if (isTyping) {
          typingUsers[socket.id] = username;
        } else {
          delete typingUsers[socket.id];
        }

        io.emit('typing_users', Object.values(typingUsers));
      }
    });

    // Handle private messages
    socket.on('private_message', ({ to, message }) => {
      const messageData = {
        id: Date.now(),
        sender: users[socket.id]?.username || 'Anonymous',
        senderId: socket.id,
        message,
        timestamp: new Date().toISOString(),
        isPrivate: true,
      };

      socket.to(to).emit('private_message', messageData);
      socket.emit('private_message', messageData);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (users[socket.id]) {
        const { username } = users[socket.id];
        io.emit('user_left', { username, id: socket.id });
        console.log(`${username} left the chat`);
      }

      delete users[socket.id];
      delete typingUsers[socket.id];

      io.emit('user_list', Object.values(users));
      io.emit('typing_users', Object.values(typingUsers));
    });
  });
};
