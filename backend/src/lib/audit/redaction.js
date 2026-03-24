const crypto = require('node:crypto');

const HASHABLE_KEYS = new Set([
  'email',
  'phone',
  'mobile',
  'full_name',
  'name',
  'first_name',
  'last_name',
  'address',
  'city',
  'state',
  'postal_code',
  'zip',
  'dob',
  'date_of_birth',
  'aadhar',
  'aadhaar',
  'pan',
  'passport',
  'ssn',
  'tax_id',
]);

const REDACT_ONLY_KEYS = new Set([
  'password',
  'current_password',
  'new_password',
  'confirm_password',
  'token',
  'refresh_token',
  'access_token',
  'secret',
  'client_secret',
  'otp',
  'verification_code',
  'authorization',
  'cookie',
  'set-cookie',
]);

const DEFAULT_OPTIONS = {
  hashPrefix: 'hmac',
  maxDepth: 6,
  maxArrayLength: 25,
  maxStringLength: 512,
};

function createDigest(value, secret, hashPrefix) {
  return `${hashPrefix}:${crypto.createHmac('sha256', secret).update(String(value)).digest('hex').slice(0, 16)}`;
}

function truncateString(value, maxStringLength) {
  if (typeof value !== 'string') {
    return value;
  }

  if (value.length <= maxStringLength) {
    return value;
  }

  return `${value.slice(0, maxStringLength)}...[truncated]`;
}

function compact(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => compact(item))
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === 'object') {
    const output = {};

    for (const [key, item] of Object.entries(value)) {
      const normalized = compact(item);

      if (normalized !== undefined) {
        output[key] = normalized;
      }
    }

    return output;
  }

  return value;
}

function redactScalar(key, value, options, secret) {
  const normalizedKey = String(key).toLowerCase();

  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (REDACT_ONLY_KEYS.has(normalizedKey)) {
    return '[REDACTED]';
  }

  if (HASHABLE_KEYS.has(normalizedKey)) {
    return createDigest(value, secret, options.hashPrefix);
  }

  return truncateString(value, options.maxStringLength);
}

function redactObject(value, options = {}, secret, depth = 0) {
  const merged = { ...DEFAULT_OPTIONS, ...options };

  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== 'object') {
    return truncateString(value, merged.maxStringLength);
  }

  if (depth >= merged.maxDepth) {
    return '[MAX_DEPTH_REACHED]';
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, merged.maxArrayLength)
      .map((item) => redactObject(item, merged, secret, depth + 1));
  }

  const output = {};

  for (const [key, item] of Object.entries(value)) {
    if (item && typeof item === 'object') {
      output[key] = redactObject(item, merged, secret, depth + 1);
      continue;
    }

    output[key] = redactScalar(key, item, merged, secret);
  }

  return compact(output);
}

function getIpPrefix(ipAddress) {
  if (!ipAddress || typeof ipAddress !== 'string') {
    return null;
  }

  if (ipAddress.includes('.')) {
    const parts = ipAddress.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
    }
  }

  if (ipAddress.includes(':')) {
    const parts = ipAddress.split(':').slice(0, 4);
    return `${parts.join(':')}::/64`;
  }

  return null;
}

function stripQueryString(url) {
  if (!url || typeof url !== 'string') {
    return url || null;
  }

  return url.split('?')[0];
}

function protectRequestContext(request = {}, secret, options = {}) {
  const merged = { ...DEFAULT_OPTIONS, ...options };
  const normalized = {
    requestId: request.requestId || null,
    method: request.method || null,
    route: request.route || stripQueryString(request.url || request.path || null),
    source: request.source || null,
  };

  if (request.ip) {
    normalized.ipHash = createDigest(request.ip, secret, merged.hashPrefix);
    normalized.ipPrefix = getIpPrefix(request.ip);
    if (options.captureRawRequestIdentifiers) {
      normalized.ip = request.ip;
    }
  }

  if (request.userAgent) {
    normalized.userAgentHash = createDigest(request.userAgent, secret, merged.hashPrefix);
    if (options.captureRawRequestIdentifiers) {
      normalized.userAgent = truncateString(request.userAgent, merged.maxStringLength);
    }
  }

  if (request.headers && typeof request.headers === 'object' && Object.keys(request.headers).length > 0) {
    normalized.headers = redactObject(request.headers, merged, secret);
  }

  if (request.query && typeof request.query === 'object' && Object.keys(request.query).length > 0) {
    normalized.query = redactObject(request.query, merged, secret);
  }

  return compact(normalized);
}

module.exports = {
  DEFAULT_REDACTION_OPTIONS: DEFAULT_OPTIONS,
  compact,
  createDigest,
  getIpPrefix,
  protectRequestContext,
  redactObject,
  stripQueryString,
};
