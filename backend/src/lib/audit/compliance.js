const env = require('../../config/env');

const CONSUMER_REQUEST_TYPES = [
  'delete',
  'correct',
  'know',
  'access_admt',
  'opt_out_sale_share',
  'limit_sensitive_use',
  'opt_out_admt',
];

const STARTER_RETENTION_POLICIES = {
  general: {
    days: env.auditRetentionDaysGeneral,
    note: 'Short operational retention for a small Atlas cluster.',
  },
  security: {
    days: env.auditRetentionDaysSecurity,
    note: 'Short security-monitoring retention tuned for this project.',
  },
  admin_change: {
    days: env.auditRetentionDaysAdminChange,
    note: 'Administrative accountability retention tuned for this project.',
  },
  consumer_request: { days: 30, note: 'Compact retention profile for non-core audit activity.' },
  consent: { days: 30, note: 'Compact consent-evidence retention profile.' },
  data_access: { days: 14, note: 'Compact access-accountability retention profile.' },
  breach: { days: 30, note: 'Compact breach-response retention profile.' },
};

const COMPLIANCE_PRESETS = {
  general: {
    purposeCode: 'operational_accountability',
    basisHints: {
      gdpr: 'review_required',
      ccpa: 'business_purpose_review_required',
      dpdpa: 'review_required',
    },
    retentionKey: 'general',
  },
  security: {
    purposeCode: 'security_monitoring',
    basisHints: {
      gdpr: 'legitimate_interests_review_required',
      ccpa: 'business_purpose',
      dpdpa: 'security_safeguards_review_required',
    },
    retentionKey: 'security',
  },
  admin_change: {
    purposeCode: 'administrative_accountability',
    basisHints: {
      gdpr: 'legitimate_interests_review_required',
      ccpa: 'business_purpose',
      dpdpa: 'review_required',
    },
    retentionKey: 'admin_change',
  },
  consumer_request: {
    purposeCode: 'data_subject_request_handling',
    basisHints: {
      gdpr: 'legal_obligation_review_required',
      ccpa: 'recordkeeping',
      dpdpa: 'rights_and_grievance_handling_review_required',
    },
    retentionKey: 'consumer_request',
  },
  consent: {
    purposeCode: 'consent_evidence',
    basisHints: {
      gdpr: 'consent',
      ccpa: 'notice_and_choice_review_required',
      dpdpa: 'consent',
    },
    retentionKey: 'consent',
  },
  data_access: {
    purposeCode: 'access_accountability',
    basisHints: {
      gdpr: 'legitimate_interests_or_legal_obligation_review_required',
      ccpa: 'business_purpose',
      dpdpa: 'review_required',
    },
    retentionKey: 'data_access',
  },
  breach: {
    purposeCode: 'breach_response',
    basisHints: {
      gdpr: 'legal_obligation_review_required',
      ccpa: 'security_and_legal_obligation_review_required',
      dpdpa: 'breach_notice_and_security_review_required',
    },
    retentionKey: 'breach',
  },
};

function addDuration(start, policy) {
  const end = new Date(start.getTime());

  if (policy.years) {
    end.setUTCFullYear(end.getUTCFullYear() + policy.years);
  }

  if (policy.months) {
    end.setUTCMonth(end.getUTCMonth() + policy.months);
  }

  if (policy.days) {
    end.setUTCDate(end.getUTCDate() + policy.days);
  }

  if (policy.hours) {
    end.setUTCHours(end.getUTCHours() + policy.hours);
  }

  return end;
}

function normalizeClassification(classification) {
  if (!classification) {
    return 'general';
  }

  if (COMPLIANCE_PRESETS[classification]) {
    return classification;
  }

  return 'general';
}

function resolvePreset(classification, overrides = {}) {
  const key = normalizeClassification(classification);
  const preset = COMPLIANCE_PRESETS[key];

  return {
    classification: key,
    purposeCode: overrides.purposeCode || preset.purposeCode,
    basisHints: {
      ...preset.basisHints,
      ...(overrides.basisHints || {}),
    },
    retentionKey: overrides.retentionKey || preset.retentionKey,
  };
}

function resolveRetention({
  classification,
  now,
  retention = {},
  retentionPolicies = STARTER_RETENTION_POLICIES,
}) {
  const resolvedPreset = resolvePreset(classification);
  const namedPolicy = retention.key ? retentionPolicies[retention.key] : retentionPolicies[resolvedPreset.retentionKey];
  const retainUntil = retention.retainUntil
    ? new Date(retention.retainUntil)
    : addDuration(now, retention.duration || namedPolicy || retentionPolicies.general);

  return {
    key: retention.key || resolvedPreset.retentionKey,
    legalHold: Boolean(retention.legalHold),
    note: retention.note || (namedPolicy ? namedPolicy.note : STARTER_RETENTION_POLICIES.general.note),
    retainUntil: retainUntil.toISOString(),
  };
}

function normalizeConsumerRequest(request = {}) {
  if (!request || !request.type) {
    return null;
  }

  return {
    type: request.type,
    phase: request.phase || 'received',
    correlationId: request.correlationId || null,
    channel: request.channel || null,
    decision: request.decision || null,
    denialReason: request.denialReason || null,
    requestedAt: request.requestedAt || null,
    respondedAt: request.respondedAt || null,
  };
}

function createMetricsBucket() {
  return {
    received: 0,
    compliedInWholeOrPart: 0,
    denied: 0,
    meanResponseDays: null,
    medianResponseDays: null,
  };
}

function summarizeConsumerRequestMetrics(events = []) {
  const requestsByCorrelationId = new Map();

  for (const event of events) {
    if (event.classification !== 'consumer_request' || !event.consumerRequest?.type) {
      continue;
    }

    const correlationId = event.consumerRequest.correlationId || event.eventId;
    const current = requestsByCorrelationId.get(correlationId) || {
      requestType: event.consumerRequest.type,
      receivedAt: null,
      respondedAt: null,
      decision: null,
    };

    if (event.consumerRequest.phase === 'received') {
      current.receivedAt = event.consumerRequest.requestedAt || event.createdAt;
      current.requestType = event.consumerRequest.type;
    }

    if (event.consumerRequest.phase === 'responded') {
      current.respondedAt = event.consumerRequest.respondedAt || event.createdAt;
      current.decision = event.consumerRequest.decision || 'denied';
      current.requestType = event.consumerRequest.type;
    }

    requestsByCorrelationId.set(correlationId, current);
  }

  const metrics = {};
  const responseTimes = {};

  for (const requestType of CONSUMER_REQUEST_TYPES) {
    metrics[requestType] = createMetricsBucket();
    responseTimes[requestType] = [];
  }

  for (const request of requestsByCorrelationId.values()) {
    if (!metrics[request.requestType]) {
      metrics[request.requestType] = createMetricsBucket();
      responseTimes[request.requestType] = [];
    }

    metrics[request.requestType].received += 1;

    if (request.decision === 'fulfilled' || request.decision === 'partial') {
      metrics[request.requestType].compliedInWholeOrPart += 1;
    }

    if (request.decision === 'denied') {
      metrics[request.requestType].denied += 1;
    }

    if (request.receivedAt && request.respondedAt) {
      const receivedAt = new Date(request.receivedAt);
      const respondedAt = new Date(request.respondedAt);
      const diffDays = (respondedAt.getTime() - receivedAt.getTime()) / (1000 * 60 * 60 * 24);

      if (!Number.isNaN(diffDays) && Number.isFinite(diffDays)) {
        responseTimes[request.requestType].push(diffDays);
      }
    }
  }

  for (const [requestType, values] of Object.entries(responseTimes)) {
    if (values.length === 0) {
      continue;
    }

    values.sort((left, right) => left - right);
    const sum = values.reduce((total, item) => total + item, 0);
    const middle = Math.floor(values.length / 2);

    metrics[requestType].meanResponseDays = Number((sum / values.length).toFixed(2));
    metrics[requestType].medianResponseDays =
      values.length % 2 === 0
        ? Number((((values[middle - 1] + values[middle]) / 2)).toFixed(2))
        : Number(values[middle].toFixed(2));
  }

  return metrics;
}

module.exports = {
  COMPLIANCE_PRESETS,
  CONSUMER_REQUEST_TYPES,
  STARTER_RETENTION_POLICIES,
  normalizeClassification,
  normalizeConsumerRequest,
  resolvePreset,
  resolveRetention,
  summarizeConsumerRequestMetrics,
};
