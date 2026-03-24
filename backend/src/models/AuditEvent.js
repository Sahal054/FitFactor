const mongoose = require('mongoose');

const auditEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    classification: {
      type: String,
      required: true,
      index: true,
    },
    severity: {
      type: String,
      default: 'low',
    },
    service: {
      type: String,
      required: true,
    },
    environment: {
      type: String,
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    subject: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    resource: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    request: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    outcome: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    consumerRequest: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    compliance: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    retention: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    integrity: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: {
        expires: 0,
      },
    },
  },
  {
    versionKey: false,
  },
);

function createAuditEventModel(connection) {
  return connection.models.AuditEvent || connection.model('AuditEvent', auditEventSchema, 'audit_events');
}

module.exports = {
  auditEventSchema,
  createAuditEventModel,
};
