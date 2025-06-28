const { User } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async function (req, res, next) {
  try {
    console.log('[isAdmin middleware] Called');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.warn('[isAdmin middleware] No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('[isAdmin middleware] Decoded JWT:', decoded);
    const user = await User.findByPk(decoded.id);
    console.log('[isAdmin middleware] User from DB:', user ? { id: user.id, is_admin: user.is_admin } : null);
    if (!user || !user.is_admin) {
      console.warn('[isAdmin middleware] Admin check failed', { user });
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('[isAdmin middleware] Error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
}; 