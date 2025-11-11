# Real-Time Chat Application - Setup & Run Guide

## Screenshots

### Login/Register Screen
```
![Screenshot](./screenshots/login.png)
![Screenshot](./screenshots/register.png)
![Screenshot](./screenshots/inside.png)
![Screenshot](./screenshots/page2.png)




## Architecture Overview

### Server (Node.js + Express + Socket.IO + MongoDB)
- **Port:** 5000 (default, configurable via PORT env var)
- **Database:** MongoDB (local or via MONGODB_URI env var)
- **Socket.IO:** Bidirectional real-time communication

### Client (React + Vite + Socket.IO Client)
- **Port:** 5173 (default Vite dev server)
- **Server URL:** Configurable via VITE_SOCKET_URL env var (default: http://localhost:5000)

---

## Quick Start

### 1. Install Dependencies

#### Server
```bash
cd server
npm install
```

#### Client
```bash
cd client
npm install
```

### 2. Start MongoDB (required for server)

```bash
# Option A: Local MongoDB
mongod

# Option B: MongoDB Atlas (update .env with MONGODB_URI)
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/chat-app
```

### 3. Start the Server

```bash
cd server
npm run dev
# or
npm start
```

**Expected output:**
```
MongoDB connected .....!: localhost
Server running on port 5000
```

### 4. Start the Client (in a new terminal)

```bash
cd client
npm run dev
```

**Expected output:**
```
VITE v7.2.2  ready in 123 ms
➜  Local:   http://localhost:5173/
```

### 5. (Optional) Seed Sample Data

To populate your database with sample users and messages for testing:

```bash
cd server
node scripts/seedDatabase.js
```

**What gets created:**
- 4 sample users: `alice`, `bob`, `charlie`, `diana` (password: `password123`)
- 8 sample chat messages with realistic conversation
- 3 sample chat rooms: general, random, development

**Now you can:**
1. Login as different users in different browser tabs
2. See message history immediately
3. Test multi-user chat experience with sample data

**Expected output:**
```
Connected to MongoDB
Cleared existing data
Created user: alice
Created user: bob
Created user: charlie
Created user: diana
Created message: "Hey everyone! Welcome to the chat app! 👋"
...
Database seeded successfully!

Sample Users (password: "password123"):
  - alice
  - bob
  - charlie
  - diana

You can now login with any of these credentials!
```

---

## Available Endpoints & Events

### HTTP Routes

#### Authentication
- `POST /api/auth/register` — { username, password } → { user, token }
- `POST /api/auth/login` — { username, password } → { user, token }

#### Messages
- `GET /api/messages?limit=50&room=roomId` — list messages
- `POST /api/messages` — { text, room?, recipients? } → message

#### Users
- `GET /api/users` — list all users
- `GET /api/users/:id` — get user profile
- `PUT /api/users/:id` — { avatar?, bio?, status? } → updated user

#### Rooms
- `POST /api/rooms` — { name, description?, isPrivate? } → room
- `GET /api/rooms` — list all rooms
- `GET /api/rooms/:id` — get room details
- `POST /api/rooms/:id/join` — join a room
- `POST /api/rooms/:id/leave` — leave a room

#### Health
- `GET /health` — { status: 'ok', uptime, now }

### Socket.IO Events

#### Client → Server
- `user_join` — username (string)
- `send_message` — { text, room?, recipients? }
- `typing` — boolean (true/false)
- `private_message` — { to: socketId, message: string }
- `join_room` — roomId
- `leave_room` — roomId

#### Server → Client
- `connect` — automatic on successful connection
- `disconnect` — automatic on disconnection
- `user_list` — [{ id, username }, ...]
- `user_joined` — { id, username }
- `user_left` — { id, username }
- `receive_message` — { id, text, sender, timestamp, room?, isPrivate? }
- `typing_users` — [username, ...]
- `private_message` — { id, message, sender, timestamp, isPrivate: true }

---

## Project Structure

```
server/
├── server.js              # Main entry point
├── package.json
├── .env                   # PORT, JWT_SECRET, MONGODB_URI
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   ├── User.js           # User schema
│   ├── Message.js        # Message schema
│   ├── Room.js           # Room schema
│   ├── Attachment.js     # File attachment schema
│   ├── Activity.js       # Activity log schema
│   └── index.js          # Model exports
├── controllers/
│   ├── authController.js       # Register/login
│   ├── messageController.js    # Message CRUD
│   ├── userController.js       # User management
│   ├── roomController.js       # Room management
│   ├── presenceController.js   # User presence
│   ├── typingController.js     # Typing indicators
│   ├── privateMessageController.js
│   ├── adminController.js
│   ├── healthController.js
│   └── attachmentController.js
├── routes/
│   ├── auth.js
│   ├── messages.js
│   ├── users.js
│   ├── rooms.js
│   └── health.js
└── socket/
    ├── handlers.js       # Socket event handlers
    └── middlewares.js    # JWT auth middleware

client/
├── src/
│   ├── main.jsx          # Entry point
│   ├── App.jsx           # Main app component
│   ├── App.css
│   ├── index.css
│   ├── components/
│   │   ├── Login.jsx     # Login form
│   │   └── Chat.jsx      # Chat UI
│   ├── context/
│   │   └── AppContext.jsx # Global state
│   ├── socket/
│   │   └── socket.js     # Socket.IO client setup
│   ├── hooks/            # Custom React hooks
│   └── pages/            # Page components
├── package.json
├── .env.local            # VITE_SOCKET_URL
└── vite.config.js
```

---

## Key Features Implemented

✅ **Authentication** — Register/login with JWT  
✅ **Real-time Messaging** — Socket.IO pub/sub  
✅ **Typing Indicators** — Show who's typing  
✅ **User Presence** — Online users list  
✅ **Private Messages** — Direct user-to-user chat  
✅ **Rooms** — Create and join chat rooms  
✅ **User Profiles** — Avatar, bio, status  
✅ **Activity Logging** — Track user actions  
✅ **File Attachments** — Schema for file uploads  

---

## Environment Variables

### Server (.env)
```
PORT=5000
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/chat-app
CLIENT_URL=http://localhost:5173
```

### Client (.env.local)
```
VITE_SOCKET_URL=http://localhost:5000
```

---

## Testing the Application

### 1. Open Browser
Navigate to `http://localhost:5173`

### 2. Login
Enter a username (e.g., "Alice") and click "Join Chat"

### 3. Open Another Browser Tab/Window
Login with a different username (e.g., "Bob")

### 4. Send Messages
Type a message and press Enter or click Send

### 5. Observe Real-Time Features
- Typing indicators appear as you type
- User list updates when someone joins/leaves
- Messages appear instantly across all connected clients

---

## Testing the Application

### 1. Open Browser
Navigate to `http://localhost:5173`

### 2. Login
Enter a username (e.g., "Alice") and click "Join Chat"

### 3. Open Another Browser Tab/Window
Login with a different username (e.g., "Bob")

### 4. Send Messages
Type a message and press Enter or click Send

### 5. Observe Real-Time Features
- Typing indicators appear as you type
- User list updates when someone joins/leaves
- Messages appear instantly across all connected clients

---

## Troubleshooting

### MongoDB Connection Error
```
Error connecting to MongoDB: connect ECONNREFUSED
```
**Solution:** Ensure MongoDB is running locally or update MONGODB_URI in .env

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in .env or kill the process using port 5000

### Socket.IO Connection Error
```
WebSocket connection failed
```
**Solution:** Verify server is running


 and VITE_SOCKET_URL is correct

### Module Not Found Errors
```
Cannot find module 'mongoose'
```
**Solution:** Run `npm install` in server directory

---

## Next Steps

1. **Database Persistence** — Data is persisted to MongoDB
2. **Authentication** — Complete JWT-based auth flow for socket connections
3. **Rooms & Channels** — Implement room isolation and permissions
4. **Notifications** — Add push notifications for offline users
5. **Tests** — Add unit and integration tests
6. **Deployment** — Deploy to Heroku, AWS, or similar

---

## Documentation

- **Socket.IO Docs:** https://socket.io/docs/
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **Mongoose Docs:** https://mongoosejs.com/


---**Status:** ✅ Ready for development
