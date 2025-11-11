// server/models/Message.js
// Mongoose schema for chat messages

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: String,
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    attachments: [String],
    reactions: {
      type: Map,
      of: [mongoose.Schema.Types.ObjectId],
      default: new Map(),
    },
    deletedAt: Date,
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

module.exports = mongoose.model('Message', messageSchema);
