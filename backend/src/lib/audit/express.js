const { stripQueryString } = require('./redaction');

function defaultResultForStatus(statusCode) {
  if (statusCode >= 200 && statusCode < 400) {
    return 'success';
  }

  if (statusCode === 401 || statusCode === 403) {
    return 'denied';
  }

  if (statusCode >= 500) {
    return 'error';
  }

  return 'failure';
}

function createExpressAuditMiddleware(logger, options = {}) {
  if (!logger || typeof logger.log !== 'function') {
    throw new TypeError('createExpressAuditMiddleware requires an AuditLogger instance');
  }

  const shouldLog = options.shouldLog || (() => true);

  return function expressAuditMiddleware(req, res, next) {
    const startedAt = Date.now();

    res.once('finish', async () => {
      if (!shouldLog(req, res)) {
        return;
      }

      const localAudit = res.locals?.audit || {};
      const route =
        localAudit.route ||
        req.route?.path ||
        stripQueryString(req.originalUrl || req.url || null);

      const event = {
        eventType: localAudit.eventType || options.eventType || `${req.method.toLowerCase()}.${route || 'request'}`,
        action: localAudit.action || options.action || `${req.method.toLowerCase()}_${String(route || 'request').replace(/[\\/:]+/g, '_')}`,
        classification: localAudit.classification || options.classification || 'general',
        severity: localAudit.severity || options.severity || 'low',
        actor: localAudit.actor || {
          type: req.user?.user_type || (req.user ? 'user' : 'anonymous'),
          id: req.user?.id || null,
          role: req.user?.role || req.user?.user_type || null,
        },
        subject: localAudit.subject || null,
        resource: localAudit.resource || {
          type: route ? String(route).split('/').filter(Boolean)[0] || 'request' : 'request',
          id: req.params?.id || req.params?.userId || req.params?.propertyId || null,
        },
        request: {
          requestId: req.id || req.headers?.['x-request-id'] || null,
          ip: req.ip || req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || null,
          userAgent: req.get ? req.get('user-agent') : req.headers?.['user-agent'],
          method: req.method,
          route,
          url: req.originalUrl || req.url || null,
        },
        outcome: {
          result: localAudit.outcome?.result || defaultResultForStatus(res.statusCode),
          httpStatus: res.statusCode,
          durationMs: Date.now() - startedAt,
        },
        data: localAudit.data || null,
        metadata: {
          ...(options.metadata || {}),
          ...(localAudit.metadata || {}),
        },
        compliance: localAudit.compliance || options.compliance || null,
        retention: localAudit.retention || options.retention || null,
        consumerRequest: localAudit.consumerRequest || null,
      };

      try {
        await logger.log(event);
      } catch (error) {
        if (typeof options.onError === 'function') {
          options.onError(error, req, res);
          return;
        }

        if (process.env.NODE_ENV !== 'test') {
          console.error('Audit middleware failed to persist event:', error);
        }
      }
    });

    next();
  };
}

module.exports = {
  createExpressAuditMiddleware,
};
