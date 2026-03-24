const {
  MongoAuditTransport,
  createAuditLogger,
  createExpressAuditMiddleware,
} = require('../lib/audit');
const env = require('./env');
const { getAuditConnection } = require('./database');
const { createAuditEventModel } = require('../models/AuditEvent');

let auditLogger = null;
let auditMiddleware = null;

function initializeAudit() {
  if (auditLogger && auditMiddleware) {
    return { auditLogger, auditMiddleware };
  }

  const AuditEvent = createAuditEventModel(getAuditConnection());

  auditLogger = createAuditLogger({
    serviceName: 'fitfactor-backend',
    environment: env.nodeEnv,
    integrityKey: env.auditLogIntegrityKey,
    transport: new MongoAuditTransport({
      model: AuditEvent,
    }),
  });

  auditMiddleware = createExpressAuditMiddleware(auditLogger, {
    shouldLog(req) {
      return req.originalUrl.startsWith('/api/admin');
    },
  });

  return { auditLogger, auditMiddleware };
}

function getAuditLogger() {
  if (!auditLogger) {
    throw new Error('Audit logger has not been initialized.');
  }

  return auditLogger;
}

function getAuditMiddleware() {
  if (!auditMiddleware) {
    throw new Error('Audit middleware has not been initialized.');
  }

  return auditMiddleware;
}

module.exports = {
  initializeAudit,
  getAuditLogger,
  getAuditMiddleware,
};
