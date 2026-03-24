const express = require('express');
const mongoose = require('mongoose');
const LiveSession = require('../models/LiveSession');
const asyncHandler = require('../utils/asyncHandler');
const { authenticateAdmin } = require('../middleware/auth');
const {
  deleteSessionById,
  findAdminSessionById,
  listAdminSessions,
} = require('../services/liveSessionService');
const {
  createDirectUpload,
  createSessionPassthrough,
  deleteAsset,
} = require('../services/muxService');
const {
  calculateEndAt,
  createHttpError,
  parseScheduledAt,
  serializeAdminSession,
} = require('../utils/liveSession');

const router = express.Router();

router.use(authenticateAdmin);

router.get(
  '/live-sessions',
  asyncHandler(async (req, res) => {
    const sessions = await listAdminSessions();

    res.json({
      success: true,
      sessions,
    });
  }),
);

router.post(
  '/live-sessions',
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      coachName,
      scheduledAt,
      accessNote = '',
      originalFileName = '',
    } = req.body || {};

    if (!title?.trim() || !description?.trim() || !coachName?.trim() || !originalFileName?.trim()) {
      throw createHttpError(400, 'Title, description, coach name, and a video file are required.');
    }

    const startAt = parseScheduledAt(scheduledAt);
    const sessionId = new mongoose.Types.ObjectId();
    const muxUpload = await createDirectUpload({
      sessionId: String(sessionId),
      originalFileName,
    });

    const session = await LiveSession.create({
      _id: sessionId,
      title: title.trim(),
      description: description.trim(),
      coachName: coachName.trim(),
      startAt,
      accessNote: accessNote.trim(),
      mux: {
        uploadId: muxUpload.uploadId,
        uploadStatus: muxUpload.uploadStatus,
        assetId: muxUpload.assetId,
        assetStatus: muxUpload.assetId ? 'preparing' : 'waiting',
        sourceFileName: muxUpload.originalFileName,
        passthrough: createSessionPassthrough(String(sessionId)),
      },
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    res.locals.audit = {
      eventType: 'admin.live-session.created',
      action: 'live_session_create',
      classification: 'admin_change',
      severity: 'medium',
      actor: {
        type: 'admin',
        id: req.user.id,
        role: req.user.role,
      },
      resource: {
        type: 'live-session',
        id: String(session._id),
      },
      metadata: {
        scheduledAt: session.startAt.toISOString(),
        uploadId: session.mux.uploadId,
      },
      outcome: {
        result: 'success',
        httpStatus: 201,
      },
    };

    res.status(201).json({
      success: true,
      session: serializeAdminSession(session.toObject()),
      upload: {
        uploadId: muxUpload.uploadId,
        uploadUrl: muxUpload.uploadUrl,
      },
    });
  }),
);

router.put(
  '/live-sessions/:sessionId',
  asyncHandler(async (req, res) => {
    const {
      title,
      description,
      coachName,
      scheduledAt,
      accessNote = '',
      originalFileName = '',
    } = req.body || {};

    const session = await findAdminSessionById(req.params.sessionId);

    if (!title?.trim() || !description?.trim() || !coachName?.trim()) {
      throw createHttpError(400, 'Title, description, and coach name are required.');
    }

    const startAt = parseScheduledAt(scheduledAt);

    session.title = title.trim();
    session.description = description.trim();
    session.coachName = coachName.trim();
    session.startAt = startAt;
    session.endAt = calculateEndAt(startAt, Number(session.videoDurationSeconds) || 0);
    session.accessNote = accessNote.trim();
    session.updatedBy = req.user.id;

    let upload = null;

    if (originalFileName?.trim()) {
      await deleteAsset(session.mux.assetId);

      const muxUpload = await createDirectUpload({
        sessionId: String(session._id),
        originalFileName,
      });

      session.endAt = null;
      session.videoDurationSeconds = 0;
      session.mux.uploadId = muxUpload.uploadId;
      session.mux.uploadStatus = muxUpload.uploadStatus;
      session.mux.assetId = muxUpload.assetId;
      session.mux.assetStatus = muxUpload.assetId ? 'preparing' : 'waiting';
      session.mux.playbackId = '';
      session.mux.sourceFileName = muxUpload.originalFileName;
      session.mux.errorMessage = '';
      session.mux.lastSyncedAt = null;

      upload = {
        uploadId: muxUpload.uploadId,
        uploadUrl: muxUpload.uploadUrl,
      };
    }

    await session.save();

    res.locals.audit = {
      eventType: 'admin.live-session.updated',
      action: 'live_session_update',
      classification: 'admin_change',
      severity: 'medium',
      actor: {
        type: 'admin',
        id: req.user.id,
        role: req.user.role,
      },
      resource: {
        type: 'live-session',
        id: String(session._id),
      },
      metadata: {
        scheduledAt: session.startAt.toISOString(),
        replacedVideo: Boolean(upload),
      },
      outcome: {
        result: 'success',
        httpStatus: 200,
      },
    };

    res.json({
      success: true,
      session: serializeAdminSession(session.toObject()),
      upload,
    });
  }),
);

router.delete(
  '/live-sessions/:sessionId',
  asyncHandler(async (req, res) => {
    const session = await deleteSessionById(req.params.sessionId);

    res.locals.audit = {
      eventType: 'admin.live-session.deleted',
      action: 'live_session_delete',
      classification: 'admin_change',
      severity: 'medium',
      actor: {
        type: 'admin',
        id: req.user.id,
        role: req.user.role,
      },
      resource: {
        type: 'live-session',
        id: String(session._id),
      },
      metadata: {
        scheduledAt: session.startAt.toISOString(),
      },
      outcome: {
        result: 'success',
        httpStatus: 200,
      },
    };

    res.json({
      success: true,
      sessionId: String(session._id),
    });
  }),
);

module.exports = router;
