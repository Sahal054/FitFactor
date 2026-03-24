const env = require('./config/env');
const { connectAuditDatabase, connectDatabase } = require('./config/database');
const { initializeAudit } = require('./config/audit');

async function startServer() {
  await connectDatabase(env.mongodbUri);
  await connectAuditDatabase(env.auditMongodbUri, env.auditDatabaseName);
  initializeAudit();

  const app = require('./app');

  app.listen(env.port, () => {
    console.log(`FitFactor backend listening on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start FitFactor backend:', error);
  process.exit(1);
});
