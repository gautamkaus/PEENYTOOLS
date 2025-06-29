const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash });
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
    res.json({ token, user: { email: user.email, name: user.name, is_admin: !!user.is_admin } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Please register yourself, then login.' });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
    res.json({ token, user: { email: user.email, name: user.name, is_admin: !!user.is_admin } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ email: user.email, name: user.name, is_admin: !!user.is_admin });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router; 