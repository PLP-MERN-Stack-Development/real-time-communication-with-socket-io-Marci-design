// server/controllers/roomController.js
// Room controller with Mongoose Room model integration

const Room = require('../models/Room');

async function createRoom(req, res) {
  try {
    const { name, description, isPrivate } = req.body || {};
    if (!name) return res.status(400).json({ error: 'room name required' });

    const existing = await Room.findOne({ name });
    if (existing) return res.status(409).json({ error: 'room name exists' });

    const room = new Room({
      name,
      description: description || '',
      isPrivate: isPrivate || false,
      creator: req.user?.id || null,
      members: req.user ? [req.user.id] : [],
      admins: req.user ? [req.user.id] : [],
    });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error('Create room error:', err);
    res.status(500).json({ error: 'room creation failed' });
  }
}

async function listRooms(req, res) {
  try {
    const rooms = await Room.find()
      .populate('creator', 'username')
      .populate('members', 'username')
      .populate('lastMessage')
      .exec();
    res.json(rooms);
  } catch (err) {
    console.error('List rooms error:', err);
    res.status(500).json({ error: 'failed to fetch rooms' });
  }
}

async function getRoom(req, res) {
  try {
    const { id } = req.params;
    const room = await Room.findById(id)
      .populate('creator', 'username')
      .populate('members', 'username')
      .populate('lastMessage')
      .exec();
    if (!room) return res.status(404).json({ error: 'room not found' });
    res.json(room);
  } catch (err) {
    console.error('Get room error:', err);
    res.status(500).json({ error: 'failed to fetch room' });
  }
}

async function joinRoom(req, res) {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ error: 'room not found' });

    const userId = req.user?.id;
    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    console.error('Join room error:', err);
    res.status(500).json({ error: 'failed to join room' });
  }
}

async function leaveRoom(req, res) {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ error: 'room not found' });

    const userId = req.user?.id;
    room.members = room.members.filter(m => m.toString() !== userId);
    await room.save();
    res.json(room);
  } catch (err) {
    console.error('Leave room error:', err);
    res.status(500).json({ error: 'failed to leave room' });
  }
}

module.exports = { createRoom, listRooms, getRoom, joinRoom, leaveRoom };
