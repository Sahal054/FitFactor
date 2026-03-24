const crypto = require('node:crypto');
const env = require('../config/env');

const MUX_API_BASE_URL = 'https://api.mux.com/video/v1';
const SESSION_PASSTHROUGH_PREFIX = 'fitfactor-live-session:';

function isMuxConfigured() {
  return Boolean(env.muxTokenId && env.muxTokenSecret);
}

function createMuxServiceError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function createSessionPassthrough(sessionId) {
  return `${SESSION_PASSTHROUGH_PREFIX}${sessionId}`;
}

function extractSessionIdFromPassthrough(value = '') {
  if (!value.startsWith(SESSION_PASSTHROUGH_PREFIX)) {
    return '';
  }

  return value.slice(SESSION_PASSTHROUGH_PREFIX.length);
}

function getAuthorizationHeader() {
  if (!isMuxConfigured()) {
    throw createMuxServiceError(
      503,
      'Mux is not configured yet. Add the Mux API credentials to the backend environment file first.',
    );
  }

  const credentials = Buffer.from(`${env.muxTokenId}:${env.muxTokenSecret}`).toString('base64');
  return `Basic ${credentials}`;
}

async function muxRequest(path, options = {}) {
  const { body, headers, ...restOptions } = options;
  const response = await fetch(`${MUX_API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      Authorization: getAuthorizationHeader(),
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(headers || {}),
    },
    body,
  });

  const responseText = await response.text();
  let payload = null;

  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch (error) {
      payload = responseText;
    }
  }

  if (!response.ok) {
    throw createMuxServiceError(
      response.status,
      payload?.error?.messages?.[0] ||
        payload?.error?.message ||
        payload?.message ||
        `Mux API request failed with status ${response.status}.`,
    );
  }

  return payload?.data ?? payload;
}

async function createDirectUpload({ sessionId, originalFileName }) {
  const upload = await muxRequest('/uploads', {
    method: 'POST',
    body: JSON.stringify({
      cors_origin: env.clientUrl,
      new_asset_settings: {
        playback_policy: ['public'],
        passthrough: createSessionPassthrough(sessionId),
      },
    }),
  });

  return {
    uploadId: upload.id,
    uploadUrl: upload.url,
    uploadStatus: upload.status || 'waiting',
    assetId: upload.asset_id || '',
    originalFileName: originalFileName?.trim() || '',
  };
}

async function getDirectUpload(uploadId) {
  return muxRequest(`/uploads/${uploadId}`);
}

async function getAsset(assetId) {
  return muxRequest(`/assets/${assetId}`);
}

async function deleteAsset(assetId) {
  if (!assetId || !isMuxConfigured()) {
    return;
  }

  try {
    await muxRequest(`/assets/${assetId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    if (error.statusCode !== 404) {
      throw error;
    }
  }
}

function parseSignatureHeader(signatureHeader = '') {
  return signatureHeader
    .split(',')
    .map((part) => part.trim())
    .reduce(
      (parsed, part) => {
        const [key, value] = part.split('=');

        if (!key || !value) {
          return parsed;
        }

        if (key === 't') {
          parsed.timestamp = Number(value);
          return parsed;
        }

        if (key === 'v1') {
          parsed.signatures.push(value);
        }

        return parsed;
      },
      { timestamp: 0, signatures: [] },
    );
}

function verifyMuxWebhookSignature(signatureHeader, rawBody) {
  if (!env.muxWebhookSigningSecret) {
    throw createMuxServiceError(
      503,
      'Mux webhook signing secret is missing. Add MUX_WEBHOOK_SIGNING_SECRET before enabling webhooks.',
    );
  }

  const { timestamp, signatures } = parseSignatureHeader(signatureHeader);

  if (!timestamp || !signatures.length) {
    throw createMuxServiceError(401, 'Mux webhook signature is missing or malformed.');
  }

  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestamp);

  if (ageSeconds > env.muxWebhookToleranceSeconds) {
    throw createMuxServiceError(401, 'Mux webhook signature has expired.');
  }

  const payload = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.muxWebhookSigningSecret)
    .update(payload)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature);
  const isMatch = signatures.some((signature) => {
    try {
      const signatureBuffer = Buffer.from(signature);
      return (
        signatureBuffer.length === expectedBuffer.length &&
        crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
      );
    } catch (error) {
      return false;
    }
  });

  if (!isMatch) {
    throw createMuxServiceError(401, 'Mux webhook signature verification failed.');
  }

  return true;
}

module.exports = {
  createDirectUpload,
  createMuxServiceError,
  createSessionPassthrough,
  deleteAsset,
  extractSessionIdFromPassthrough,
  getAsset,
  getDirectUpload,
  isMuxConfigured,
  verifyMuxWebhookSignature,
};
