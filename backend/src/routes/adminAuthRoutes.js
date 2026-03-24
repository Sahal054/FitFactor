const express = require('express');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const siteContent = require('../data/siteContent');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateAdmin } = require('../middleware/auth');
const { signAdminToken } = require('../utils/auth');
const { createHttpError } = require('../utils/liveSession');
const env = require('../config/env');

const router = express.Router();

router.get('/portal', (req, res) => {
  res.json(siteContent.adminPortal);
});

router.post(
  '/signup',
  asyncHandler(async (req, res) => {
    const {
      displayName,
      username,
      password,
      inviteCode = '',
    } = req.body || {};

    if (!displayName?.trim() || !username?.trim() || !password?.trim()) {
      throw createHttpError(400, 'Display name, username, and password are required.');
    }

    if (password.trim().length < 8) {
      throw createHttpError(400, 'Password must be at least 8 characters long.');
    }

    if (
      env.adminSignupInviteCode &&
      inviteCode.trim() !== env.adminSignupInviteCode
    ) {
      throw createHttpError(403, 'A valid admin invite code is required to create an admin account.');
    }

    const normalizedUsername = username.trim().toLowerCase();
    const existingUser = await AdminUser.findOne({ username: normalizedUsername }).lean();

    if (existingUser) {
      throw createHttpError(409, 'That username is already taken.');
    }

    const passwordHash = await bcrypt.hash(password.trim(), 12);
    const adminUser = await AdminUser.create({
      displayName: displayName.trim(),
      username: normalizedUsername,
      passwordHash,
    });

    const token = signAdminToken(adminUser);

    res.locals.audit = {
      eventType: 'admin.auth.signup.succeeded',
      action: 'admin_signup',
      classification: 'admin_change',
      severity: 'medium',
      actor: {
        type: 'admin',
        id: String(adminUser._id),
        role: adminUser.role,
      },
      resource: {
        type: 'admin-user',
        id: String(adminUser._id),
      },
      metadata: {
        username: adminUser.username,
      },
      outcome: {
        result: 'success',
        httpStatus: 201,
      },
    };

    res.status(201).json({
      success: true,
      token,
      user: {
        id: String(adminUser._id),
        displayName: adminUser.displayName,
        username: adminUser.username,
        role: adminUser.role,
      },
    });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const {
      username,
      password,
    } = req.body || {};

    if (!username?.trim() || !password?.trim()) {
      throw createHttpError(400, 'Username and password are required.');
    }

    const normalizedUsername = username.trim().toLowerCase();
    const adminUser = await AdminUser.findOne({ username: normalizedUsername });

    if (!adminUser) {
      res.locals.audit = {
        eventType: 'admin.auth.login.failed',
        action: 'admin_login_failed',
        classification: 'security',
        severity: 'medium',
        metadata: {
          username: normalizedUsername,
        },
        outcome: {
          result: 'failure',
          httpStatus: 401,
        },
      };

      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password.trim(), adminUser.passwordHash);

    if (!isPasswordValid) {
      res.locals.audit = {
        eventType: 'admin.auth.login.failed',
        action: 'admin_login_failed',
        classification: 'security',
        severity: 'medium',
        actor: {
          type: 'admin',
          id: String(adminUser._id),
          role: adminUser.role,
        },
        metadata: {
          username: adminUser.username,
        },
        outcome: {
          result: 'failure',
          httpStatus: 401,
        },
      };

      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    adminUser.lastLoginAt = new Date();
    await adminUser.save();

    const token = signAdminToken(adminUser);

    res.locals.audit = {
      eventType: 'admin.auth.login.succeeded',
      action: 'admin_login',
      classification: 'security',
      severity: 'low',
      actor: {
        type: 'admin',
        id: String(adminUser._id),
        role: adminUser.role,
      },
      resource: {
        type: 'admin-session',
        id: String(adminUser._id),
      },
      outcome: {
        result: 'success',
        httpStatus: 200,
      },
    };

    return res.json({
      success: true,
      token,
      user: {
        id: String(adminUser._id),
        displayName: adminUser.displayName,
        username: adminUser.username,
        role: adminUser.role,
      },
    });
  }),
);

router.get(
  '/me',
  authenticateAdmin,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        displayName: req.user.displayName,
        username: req.user.username,
        role: req.user.role,
      },
    });
  }),
);

module.exports = router;
