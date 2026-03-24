const LiveSession = require('../models/LiveSession');
const env = require('../config/env');
const {
  buildEmptyPublicSession,
  calculateEndAt,
  createHttpError,
  getSessionStatus,
  serializeAdminSession,
  serializePublicSession,
} = require('../utils/liveSession');
const {
  deleteAsset,
  extractSessionIdFromPassthrough,
  getAsset,
  getDirectUpload,
  isMuxConfigured,
} = require('./muxService');

function applyUploadSnapshot(session, upload) {
  if (!upload) {
    return false;
  }

  let hasChanges = false;
  const nextUploadStatus = upload.status || session.mux.uploadStatus || 'waiting';
  const nextAssetId = upload.asset_id || session.mux.assetId || '';

  if (session.mux.uploadStatus !== nextUploadStatus) {
    session.mux.uploadStatus = nextUploadStatus;
    hasChanges = true;
  }

  if (session.mux.assetId !== nextAssetId) {
    session.mux.assetId = nextAssetId;
    hasChanges = true;
  }

  if (nextAssetId && session.mux.assetStatus === 'waiting') {
    session.mux.assetStatus = 'preparing';
    hasChanges = true;
  }

  return hasChanges;
}

function applyAssetSnapshot(session, asset) {
  if (!asset) {
    return false;
  }

  let hasChanges = false;
  const playbackId = asset.playback_ids?.[0]?.id || '';
  const durationSeconds = Math.max(0, Math.ceil(Number(asset.duration) || 0));
  const assetStatus = asset.status || session.mux.assetStatus || 'preparing';
  const assetErrorMessage = asset.errors?.messages?.[0] || '';
  const endAt = calculateEndAt(new Date(session.startAt), durationSeconds);

  if (session.mux.assetStatus !== assetStatus) {
    session.mux.assetStatus = assetStatus;
    hasChanges = true;
  }

  if (session.mux.playbackId !== playbackId) {
    session.mux.playbackId = playbackId;
    hasChanges = true;
  }

  if ((Number(session.videoDurationSeconds) || 0) !== durationSeconds) {
    session.videoDurationSeconds = durationSeconds;
    hasChanges = true;
  }

  if ((session.endAt?.getTime() || 0) !== (endAt?.getTime() || 0)) {
    session.endAt = endAt;
    hasChanges = true;
  }

  if (session.mux.errorMessage !== assetErrorMessage) {
    session.mux.errorMessage = assetErrorMessage;
    hasChanges = true;
  }

  return hasChanges;
}

async function pruneStoredSessions(excludedSessionId = '') {
  const readySessions = await LiveSession.find({
    'mux.assetId': { $ne: '' },
    'mux.assetStatus': 'ready',
  }).sort({ createdAt: 1, _id: 1 });

  const removableSessions = readySessions.filter(
    (session) => String(session._id) !== String(excludedSessionId || ''),
  );
  const overflowCount = readySessions.length - env.maxStoredMuxVideos;

  if (overflowCount <= 0) {
    return;
  }

  const sessionsToRemove = removableSessions.slice(0, overflowCount);

  for (const session of sessionsToRemove) {
    await deleteAsset(session.mux.assetId);
    await session.deleteOne();
  }
}

async function syncSessionWithMux(session) {
  if (!session || !isMuxConfigured()) {
    return session;
  }

  let hasChanges = false;

  if (session.mux?.uploadId && !session.mux?.assetId && session.mux?.assetStatus !== 'errored') {
    try {
      const upload = await getDirectUpload(session.mux.uploadId);
      hasChanges = applyUploadSnapshot(session, upload) || hasChanges;
    } catch (error) {
      // Local polling should not take the app down if Mux is temporarily unavailable.
    }
  }

  if (
    session.mux?.assetId &&
    (
      session.mux.assetStatus !== 'ready' ||
      !session.mux.playbackId ||
      !(Number(session.videoDurationSeconds) > 0)
    )
  ) {
    try {
      const asset = await getAsset(session.mux.assetId);
      hasChanges = applyAssetSnapshot(session, asset) || hasChanges;
    } catch (error) {
      // Keep the last known state and try again on the next poll.
    }
  }

  if (hasChanges) {
    session.mux.lastSyncedAt = new Date();
    await session.save();

    if (session.mux.assetStatus === 'ready' && session.mux.assetId) {
      await pruneStoredSessions(session._id);
    }
  }

  return session;
}

async function syncSessions(sessions) {
  return Promise.all(sessions.map((session) => syncSessionWithMux(session)));
}

function sortByStartAscending(left, right) {
  return (
    new Date(left.startAt) - new Date(right.startAt) ||
    String(left._id).localeCompare(String(right._id))
  );
}

function sortByStartDescending(left, right) {
  return (
    new Date(right.startAt) - new Date(left.startAt) ||
    String(right._id).localeCompare(String(left._id))
  );
}

async function findSessionForPublic(referenceDate = new Date()) {
  const sessions = await syncSessions(
    await LiveSession.find({}).sort({ startAt: 1, _id: 1 }),
  );

  const liveOrCurrentSession = [...sessions]
    .filter((session) => ['live', 'processing', 'video-error'].includes(getSessionStatus(session, referenceDate)))
    .sort(sortByStartDescending)[0];

  if (liveOrCurrentSession) {
    return serializePublicSession(liveOrCurrentSession, referenceDate);
  }

  const upcomingSession = [...sessions]
    .filter((session) => new Date(session.startAt) > referenceDate)
    .sort(sortByStartAscending)[0];

  if (upcomingSession) {
    return serializePublicSession(upcomingSession, referenceDate);
  }

  const mostRecentSession = [...sessions]
    .filter((session) => getSessionStatus(session, referenceDate) === 'ended')
    .sort(sortByStartDescending)[0];

  if (mostRecentSession) {
    return serializePublicSession(mostRecentSession, referenceDate);
  }

  return buildEmptyPublicSession();
}

async function listAdminSessions(referenceDate = new Date()) {
  const sessions = await syncSessions(
    await LiveSession.find({}).sort({ startAt: 1, _id: 1 }),
  );

  return sessions.map((session) => serializeAdminSession(session, referenceDate));
}

async function findAdminSessionById(sessionId) {
  const session = await LiveSession.findById(sessionId);

  if (!session) {
    throw createHttpError(404, 'Live session not found.');
  }

  return syncSessionWithMux(session);
}

async function findSessionByMuxUploadId(uploadId) {
  if (!uploadId) {
    return null;
  }

  return LiveSession.findOne({ 'mux.uploadId': uploadId });
}

async function findSessionByMuxAssetId(assetId) {
  if (!assetId) {
    return null;
  }

  return LiveSession.findOne({ 'mux.assetId': assetId });
}

async function handleMuxWebhookEvent(event = {}) {
  const eventType = event.type || '';
  const eventData = event.data || {};

  if (!eventType) {
    return;
  }

  if (eventType === 'video.upload.asset_created') {
    const session =
      (await findSessionByMuxUploadId(eventData.id || eventData.upload_id)) ||
      (await LiveSession.findById(extractSessionIdFromPassthrough(eventData.passthrough || '')));

    if (!session) {
      return;
    }

    applyUploadSnapshot(session, eventData);
    session.mux.lastSyncedAt = new Date();
    await session.save();
    return;
  }

  if (eventType === 'video.asset.ready' || eventType === 'video.asset.errored') {
    const session =
      (await findSessionByMuxAssetId(eventData.id)) ||
      (await LiveSession.findById(extractSessionIdFromPassthrough(eventData.passthrough || '')));

    if (!session) {
      return;
    }

    applyAssetSnapshot(session, eventData);
    session.mux.lastSyncedAt = new Date();
    await session.save();

    if (session.mux.assetStatus === 'ready' && session.mux.assetId) {
      await pruneStoredSessions(session._id);
    }
  }
}

async function deleteSessionById(sessionId) {
  const session = await LiveSession.findById(sessionId);

  if (!session) {
    throw createHttpError(404, 'Live session not found.');
  }

  await deleteAsset(session.mux.assetId);
  await session.deleteOne();

  return session;
}

module.exports = {
  deleteSessionById,
  findAdminSessionById,
  findSessionForPublic,
  handleMuxWebhookEvent,
  listAdminSessions,
};
