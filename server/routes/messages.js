// server/routes/messages.js
// Message endpoints: list, create

const express = require('express');
const { listMessages, createMessage } = require('../controllers/messageController');

const router = express.Router();

// GET /api/messages - List messages
router.get('/', async (req, res) => {
  try {
    const { limit = 50, room } = req.query;
    const messages = await listMessages({ limit: parseInt(limit), room });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch messages' });
  }
});

// POST /api/messages - Create message (requires auth in production)
router.post('/', async (req, res) => {
  try {
    const { text, room, recipients } = req.body || {};
    if (!text) return res.status(400).json({ error: 'text required' });

    // In production, get senderId from req.user (JWT auth)
    const senderId = req.user?.id || 'anonymous';
    const senderName = req.user?.username || 'Anonymous';

    const message = await createMessage({ text, room, recipients }, senderId, senderName);
    res.status(201).json(message);
  } catch (err) {
    console.error('Create message error:', err);
    res.status(500).json({ error: 'failed to create message' });
  }
});

module.exports = router;
