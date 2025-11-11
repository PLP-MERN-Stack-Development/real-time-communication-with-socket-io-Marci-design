// server/socket/middlewares.js
// Socket middleware helpers (e.g., JWT auth) - lightweight stub for now

const jwt = require('jsonwebtoken');

function socketAuth(secret) {
  return (socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(); // allow anonymous for now

    jwt.verify(token, secret || process.env.JWT_SECRET || 'devsecret', (err, decoded) => {
      if (err) return next();
      socket.user = decoded;
      next();
    });
  };
}

module.exports = { socketAuth };
