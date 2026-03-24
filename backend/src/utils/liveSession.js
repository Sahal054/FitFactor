function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseScheduledAt(value) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw createHttpError(400, 'Please provide a valid scheduled date and time.');
  }

  return parsedDate;
}

function calculateEndAt(startAt, durationSeconds) {
  if (!startAt || !Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    return null;
  }

  return new Date(startAt.getTime() + durationSeconds * 1000);
}

function getMuxReadiness(session) {
  const playbackId = session?.mux?.playbackId || '';
  const durationSeconds = Number(session?.videoDurationSeconds) || 0;
  return Boolean(playbackId && durationSeconds > 0 && session?.mux?.assetStatus === 'ready');
}

function getPendingVideoStatus(session) {
  if (session?.mux?.errorMessage || session?.mux?.assetStatus === 'errored') {
    return 'video-error';
  }

  if (
    !session?.mux?.assetId &&
    ['waiting', 'preparing', 'pending', 'uploading'].includes(session?.mux?.uploadStatus)
  ) {
    return 'uploading';
  }

  return 'processing';
}

function getSessionStatus(session, referenceDate = new Date()) {
  const startAt = new Date(session.startAt);
  const endAt = session.endAt
    ? new Date(session.endAt)
    : calculateEndAt(startAt, Number(session.videoDurationSeconds) || 0);

  if (Number.isNaN(startAt.getTime())) {
    return 'awaiting-update';
  }

  if (!getMuxReadiness(session)) {
    return getPendingVideoStatus(session);
  }

  if (endAt && referenceDate >= startAt && referenceDate < endAt) {
    return 'live';
  }

  if (referenceDate < startAt) {
    return 'upcoming';
  }

  return 'ended';
}

function buildAvailabilityMessage(status, session, referenceDate = new Date()) {
  if (status === 'live') {
    return 'The session is live now. Members who join late will start from the current live point on the timeline.';
  }

  if (status === 'upcoming') {
    return 'This session is scheduled in advance and will unlock automatically at the selected start time.';
  }

  if (status === 'uploading') {
    return 'The session has been scheduled and the workout video upload is still being sent to Mux.';
  }

  if (status === 'processing') {
    return referenceDate < new Date(session.startAt)
      ? 'The session has been scheduled, and Mux is still preparing the uploaded video.'
      : 'The scheduled start time has arrived, but Mux is still preparing the uploaded video.';
  }

  if (status === 'video-error') {
    return 'The uploaded workout video could not be prepared. The admin needs to upload it again.';
  }

  return 'This session has already ended. The next scheduled live slot will appear here when available.';
}

function calculateLiveOffsetSeconds(session, referenceDate = new Date()) {
  const startAt = new Date(session.startAt);
  const durationSeconds = Number(session.videoDurationSeconds) || 0;

  if (Number.isNaN(startAt.getTime()) || durationSeconds <= 0) {
    return 0;
  }

  const elapsedSeconds = Math.floor((referenceDate.getTime() - startAt.getTime()) / 1000);
  return Math.min(Math.max(elapsedSeconds, 0), durationSeconds);
}

function serializePublicSession(session, referenceDate = new Date()) {
  if (!session) {
    return null;
  }

  const status = getSessionStatus(session, referenceDate);
  const playbackEnabled = status === 'live' && getMuxReadiness(session);
  const liveOffsetSeconds = playbackEnabled ? calculateLiveOffsetSeconds(session, referenceDate) : 0;
  const endAt = session.endAt
    ? new Date(session.endAt)
    : calculateEndAt(new Date(session.startAt), Number(session.videoDurationSeconds) || 0);

  return {
    sessionId: String(session._id),
    title: session.title,
    description: session.description,
    coachName: session.coachName,
    scheduledAt: new Date(session.startAt).toISOString(),
    endsAt: endAt ? endAt.toISOString() : '',
    videoDurationSeconds: Number(session.videoDurationSeconds) || 0,
    status,
    playbackEnabled,
    playbackId: playbackEnabled ? session.mux?.playbackId || '' : '',
    liveOffsetSeconds,
    joinedAtOffsetSeconds: liveOffsetSeconds,
    videoReady: getMuxReadiness(session),
    muxStatus: session.mux?.assetStatus || 'waiting',
    accessNote: session.accessNote || buildAvailabilityMessage(status, session, referenceDate),
    availabilityMessage: buildAvailabilityMessage(status, session, referenceDate),
  };
}

function serializeAdminSession(session, referenceDate = new Date()) {
  if (!session) {
    return null;
  }

  const endAt = session.endAt
    ? new Date(session.endAt)
    : calculateEndAt(new Date(session.startAt), Number(session.videoDurationSeconds) || 0);

  return {
    sessionId: String(session._id),
    title: session.title,
    description: session.description,
    coachName: session.coachName,
    scheduledAt: new Date(session.startAt).toISOString(),
    endsAt: endAt ? endAt.toISOString() : '',
    videoDurationSeconds: Number(session.videoDurationSeconds) || 0,
    status: getSessionStatus(session, referenceDate),
    playbackId: session.mux?.playbackId || '',
    videoReady: getMuxReadiness(session),
    muxStatus: session.mux?.assetStatus || 'waiting',
    uploadStatus: session.mux?.uploadStatus || 'waiting',
    sourceFileName: session.mux?.sourceFileName || '',
    muxErrorMessage: session.mux?.errorMessage || '',
    accessNote: session.accessNote || '',
    createdAt: new Date(session.createdAt).toISOString(),
    updatedAt: new Date(session.updatedAt).toISOString(),
    createdBy: session.createdBy ? String(session.createdBy) : null,
    updatedBy: session.updatedBy ? String(session.updatedBy) : null,
  };
}

function buildEmptyPublicSession() {
  return {
    sessionId: '',
    title: 'Daily Live Session',
    description: 'A new live workout slot will appear here once the admin schedules it.',
    coachName: 'FitFactor Coaching Team',
    scheduledAt: '',
    endsAt: '',
    videoDurationSeconds: 0,
    status: 'awaiting-update',
    playbackEnabled: false,
    playbackId: '',
    liveOffsetSeconds: 0,
    joinedAtOffsetSeconds: 0,
    videoReady: false,
    muxStatus: 'waiting',
    accessNote: 'The next live session will appear here once the admin publishes it.',
    availabilityMessage: 'The next live session will appear here once the admin publishes it.',
  };
}

module.exports = {
  buildEmptyPublicSession,
  buildAvailabilityMessage,
  calculateEndAt,
  calculateLiveOffsetSeconds,
  createHttpError,
  getMuxReadiness,
  getSessionStatus,
  parseScheduledAt,
  serializeAdminSession,
  serializePublicSession,
};
