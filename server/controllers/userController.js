// server/controllers/userController.js
// User controller with Mongoose User model integration

const User = require('../models/User');

async function listUsers(req, res) {
  try {
    const users = await User.find({}, 'username avatar status lastSeen createdAt').exec();
    res.json(users);
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ error: 'failed to fetch users' });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id, 'username avatar profile status lastSeen createdAt').exec();
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'failed to fetch user' });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { avatar, bio, status } = req.body || {};
    const user = await User.findByIdAndUpdate(
      id,
      {
        ...(avatar && { 'profile.avatar': avatar }),
        ...(bio && { 'profile.bio': bio }),
        ...(status && { status }),
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json(user);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'failed to update user' });
  }
}

module.exports = { listUsers, getUser, updateUser };
