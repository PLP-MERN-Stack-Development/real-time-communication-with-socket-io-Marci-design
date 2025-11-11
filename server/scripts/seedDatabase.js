// server/scripts/seedDatabase.js
// Populate database with sample users and messages for development/testing

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const User = require('../models/User');
const Message = require('../models/Message');
const Room = require('../models/Room');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Message.deleteMany({});
    await Room.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const sampleUsers = [
      { username: 'alice', password: 'password123' },
      { username: 'bob', password: 'password123' },
      { username: 'charlie', password: 'password123' },
      { username: 'diana', password: 'password123' },
    ];

    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        username: userData.username,
        password: hashedPassword,
        profile: {
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
          bio: `${userData.username.charAt(0).toUpperCase() + userData.username.slice(1)}'s bio`,
        },
        status: 'online',
        lastSeen: new Date(),
      });
      users.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create sample messages
    const sampleMessages = [
      {
        text: 'Hey everyone! Welcome to the chat app! 👋',
        sender: users[0]._id,
        senderName: users[0].username,
        isPrivate: false,
      },
      {
        text: 'Thanks Alice! Excited to be here! 🎉',
        sender: users[1]._id,
        senderName: users[1].username,
        isPrivate: false,
      },
      {
        text: 'This is a really cool real-time chat application',
        sender: users[2]._id,
        senderName: users[2].username,
        isPrivate: false,
      },
      {
        text: 'I love the typing indicators feature! 😊',
        sender: users[3]._id,
        senderName: users[3].username,
        isPrivate: false,
      },
      {
        text: 'And the user presence list is super helpful',
        sender: users[0]._id,
        senderName: users[0].username,
        isPrivate: false,
      },
      {
        text: 'Definitely! Socket.IO makes this so smooth',
        sender: users[1]._id,
        senderName: users[1].username,
        isPrivate: false,
      },
      {
        text: 'The message history is preserved in MongoDB too',
        sender: users[2]._id,
        senderName: users[2].username,
        isPrivate: false,
      },
      {
        text: 'Perfect for a production-ready chat app! 🚀',
        sender: users[3]._id,
        senderName: users[3].username,
        isPrivate: false,
      },
    ];

    const messages = [];
    for (let i = 0; i < sampleMessages.length; i++) {
      const message = await Message.create({
        ...sampleMessages[i],
        createdAt: new Date(Date.now() - (sampleMessages.length - i) * 5000), // Spread over time
      });
      messages.push(message);
      console.log(`Created message: "${message.text.substring(0, 30)}..."`);
    }

    // Create sample rooms
    const sampleRooms = [
      {
        name: 'general',
        description: 'General discussion channel',
        creator: users[0]._id,
        members: users.map(u => u._id),
        admins: [users[0]._id],
        isPrivate: false,
      },
      {
        name: 'random',
        description: 'Off-topic conversations',
        creator: users[1]._id,
        members: users.map(u => u._id),
        admins: [users[1]._id],
        isPrivate: false,
      },
      {
        name: 'development',
        description: 'Tech and development discussions',
        creator: users[2]._id,
        members: users.slice(0, 3).map(u => u._id),
        admins: [users[2]._id],
        isPrivate: false,
      },
    ];

    for (const roomData of sampleRooms) {
      const room = await Room.create(roomData);
      console.log(`Created room: ${room.name}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nSample Users (password: "password123"):`);
    sampleUsers.forEach(u => console.log(`  - ${u.username}`));
    console.log('\nYou can now login with any of these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => seedDatabase());
