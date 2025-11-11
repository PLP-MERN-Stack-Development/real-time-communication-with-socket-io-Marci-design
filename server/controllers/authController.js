// server/controllers/authController.js
// Auth controller with Mongoose User model integration

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ error: 'username exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'devsecret');
    res.status(201).json({ user: { id: user._id, username: user.username }, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'registration failed' });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'devsecret');
    res.json({ user: { id: user._id, username: user.username }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'login failed' });
  }
}

module.exports = { register, login };
