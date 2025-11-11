// server/models/Activity.js
// Mongoose schema for user activity/notifications/logs

const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['login', 'logout', 'join_room', 'leave_room', 'send_message', 'delete_message'],
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    metadata: mongoose.Schema.Types.Mixed,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model('Activity', activitySchema);
