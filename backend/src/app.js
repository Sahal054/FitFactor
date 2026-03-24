const cors = require('cors');
const express = require('express');
const env = require('./config/env');
const { getAuditMiddleware } = require('./config/audit');
const requestContext = require('./middleware/requestContext');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const muxWebhookRoutes = require('./routes/muxWebhookRoutes');
const publicRoutes = require('./routes/publicRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminSessionRoutes = require('./routes/adminSessionRoutes');

const app = express();
const jsonParser = express.json({ limit: '1mb' });

app.set('trust proxy', 1);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: false,
  }),
);
app.use('/api/mux', express.raw({ type: 'application/json', limit: '1mb' }));
app.use(requestContext);
app.use((req, res, next) => {
  try {
    return getAuditMiddleware()(req, res, next);
  } catch (error) {
    return next(error);
  }
});

app.use('/api/mux', muxWebhookRoutes);
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/mux')) {
    return next();
  }

  return jsonParser(req, res, next);
});
app.use('/api', publicRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', adminSessionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
