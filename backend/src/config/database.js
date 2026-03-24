const mongoose = require('mongoose');

let auditConnection = null;

async function connectDatabase(mongodbUri) {
  if (!mongodbUri) {
    throw new Error('MONGODB_URI is required to connect the backend to MongoDB Atlas.');
  }

  await mongoose.connect(mongodbUri);
}

async function connectAuditDatabase(auditMongodbUri, auditDatabaseName) {
  if (!auditMongodbUri) {
    throw new Error('AUDIT_MONGODB_URI or MONGODB_URI is required for audit log storage.');
  }

  auditConnection = await mongoose.createConnection(auditMongodbUri, {
    dbName: auditDatabaseName || 'fitfactor_audit',
  }).asPromise();

  return auditConnection;
}

function getAuditConnection() {
  if (!auditConnection) {
    throw new Error('Audit database connection has not been initialized.');
  }

  return auditConnection;
}

module.exports = {
  connectDatabase,
  connectAuditDatabase,
  getAuditConnection,
};
