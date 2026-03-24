const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const env = require('../config/env');

async function authenticateAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [, token] = authHeader.split(' ');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication is required.',
      });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const adminUser = await AdminUser.findById(payload.sub).lean();

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        message: 'Your admin session is no longer valid.',
      });
    }

    req.user = {
      id: String(adminUser._id),
      username: adminUser.username,
      displayName: adminUser.displayName,
      role: adminUser.role,
      user_type: 'admin',
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Please sign in again to continue.',
    });
  }
}

module.exports = {
  authenticateAdmin,
};
