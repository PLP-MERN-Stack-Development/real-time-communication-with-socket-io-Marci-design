// server/models/User.js
// Mongoose schema for user accounts and authentication

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
    },
    profile: {
      avatar: String,
      bio: String,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'away'],
      default: 'offline',
    },
    lastSeen: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
