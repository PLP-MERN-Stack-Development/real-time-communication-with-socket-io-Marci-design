// server/routes/rooms.js
// Room endpoints: create, list, get, join, leave

const express = require('express');
const { createRoom, listRooms, getRoom, joinRoom, leaveRoom } = require('../controllers/roomController');

const router = express.Router();

router.post('/', createRoom);
router.get('/', listRooms);
router.get('/:id', getRoom);
router.post('/:id/join', joinRoom);
router.post('/:id/leave', leaveRoom);

module.exports = router;
