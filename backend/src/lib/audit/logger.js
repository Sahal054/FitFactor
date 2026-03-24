const crypto = require('node:crypto');
const {
  normalizeClassification,
  normalizeConsumerRequest,
  resolvePreset,
  resolveRetention,
  STARTER_RETENTION_POLICIES,
  summarizeConsumerRequestMetrics,
} = require('./compliance');
const {
  compact,
  protectRequestContext,
  redactObject,
} = require('./redaction');

function stableStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

function normalizeSeverity(severity) {
  const allowed = new Set(['low', 'medium', 'high', 'critical']);
  return allowed.has(severity) ? severity : 'low';
}

function normalizeOutcome(outcome = {}) {
  return compact({
    result: outcome.result || 'success',
    httpStatus: outcome.httpStatus || null,
    reasonCode: outcome.reasonCode || null,
    durationMs: outcome.durationMs || null,
  });
}

class AuditLogger {
  constructor(options = {}) {
    if (!options.transport || typeof options.transport.append !== 'function') {
      throw new TypeError('AuditLogger requires a transport with an append(event) method');
    }

    if (!options.integrityKey) {
      throw new TypeError('AuditLogger requires an integrityKey for tamper-evident hashing');
    }

    this.transport = options.transport;
    this.integrityKey = options.integrityKey;
    this.serviceName = options.serviceName || 'unknown-service';
    this.environment = options.environment || process.env.NODE_ENV || 'development';
    this.jurisdictions = options.jurisdictions || ['gdpr', 'ccpa', 'dpdpa'];
    this.redaction = options.redaction || {};
    this.retentionPolicies = {
      ...STARTER_RETENTION_POLICIES,
      ...(options.retentionPolicies || {}),
    };
    this.now = options.now || (() => new Date());
    this.captureRawRequestIdentifiers = options.captureRawRequestIdentifiers === true;
  }

  async log(input = {}) {
    if (!input.eventType) {
      throw new TypeError('Audit event must include eventType');
    }

    const now = this.now();
    const classification = normalizeClassification(input.classification);
    const preset = resolvePreset(classification, input.compliance || {});
    const actor = redactObject(input.actor || null, this.redaction, this.integrityKey);
    const subject = redactObject(input.subject || null, this.redaction, this.integrityKey);
    const resource = redactObject(input.resource || null, this.redaction, this.integrityKey);
    const data = redactObject(input.data || null, this.redaction, this.integrityKey);
    const metadata = redactObject(input.metadata || null, this.redaction, this.integrityKey);
    const consumerRequest = normalizeConsumerRequest(input.consumerRequest);
    const retention = resolveRetention({
      classification,
      now,
      retention: input.retention || {},
      retentionPolicies: this.retentionPolicies,
    });

    const baseEvent = compact({
      schemaVersion: 1,
      eventId: crypto.randomUUID(),
      eventType: input.eventType,
      action: input.action || input.eventType.replace(/\./g, '_'),
      classification,
      severity: normalizeSeverity(input.severity),
      service: this.serviceName,
      environment: this.environment,
      actor,
      subject,
      resource,
      request: protectRequestContext(input.request || {}, this.integrityKey, {
        ...this.redaction,
        captureRawRequestIdentifiers: this.captureRawRequestIdentifiers,
      }),
      outcome: normalizeOutcome(input.outcome),
      data,
      metadata,
      consumerRequest,
      compliance: {
        jurisdictions: input.compliance?.jurisdictions || this.jurisdictions,
        purposeCode: preset.purposeCode,
        basisHints: preset.basisHints,
      },
      retention,
      createdAt: now.toISOString(),
    });

    const prevHash = typeof this.transport.getLastIntegrity === 'function'
      ? await this.transport.getLastIntegrity()
      : null;

    const integrityPayload = stableStringify({
      prevHash,
      event: baseEvent,
    });

    const hash = crypto
      .createHmac('sha256', this.integrityKey)
      .update(integrityPayload)
      .digest('hex');

    const finalEvent = {
      ...baseEvent,
      integrity: {
        algorithm: 'sha256-hmac',
        prevHash,
        hash,
      },
    };

    await this.transport.append(finalEvent);
    return finalEvent;
  }

  async logSecurityEvent(event = {}) {
    return this.log({
      ...event,
      classification: 'security',
      severity: event.severity || 'medium',
      outcome: event.outcome || { result: 'failure' },
    });
  }

  async logAdminAction(event = {}) {
    return this.log({
      ...event,
      classification: 'admin_change',
      severity: event.severity || 'medium',
    });
  }

  async logDataAccess(event = {}) {
    return this.log({
      ...event,
      classification: 'data_access',
      severity: event.severity || 'low',
    });
  }

  async logConsentEvent(event = {}) {
    return this.log({
      ...event,
      classification: 'consent',
      severity: event.severity || 'low',
    });
  }

  async logDataSubjectRequest(event = {}) {
    if (!event.consumerRequest?.type) {
      throw new TypeError('logDataSubjectRequest requires consumerRequest.type');
    }

    return this.log({
      ...event,
      classification: 'consumer_request',
      severity: event.severity || 'low',
    });
  }

  async logBreachEvent(event = {}) {
    return this.log({
      ...event,
      classification: 'breach',
      severity: event.severity || 'high',
    });
  }

  async query(filters = {}) {
    if (typeof this.transport.query !== 'function') {
      throw new Error('The configured transport does not support querying');
    }

    return this.transport.query(filters);
  }

  async purgeExpired(referenceDate = new Date()) {
    if (typeof this.transport.purgeExpired !== 'function') {
      throw new Error('The configured transport does not support purgeExpired');
    }

    return this.transport.purgeExpired(referenceDate);
  }

  async getConsumerRequestMetrics(filters = {}) {
    const events = await this.query({
      ...filters,
      classification: 'consumer_request',
    });

    return summarizeConsumerRequestMetrics(events);
  }
}

function createAuditLogger(options) {
  return new AuditLogger(options);
}

module.exports = {
  AuditLogger,
  createAuditLogger,
};
