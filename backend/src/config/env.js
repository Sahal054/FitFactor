const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || '',
  auditMongodbUri: process.env.AUDIT_MONGODB_URI || process.env.MONGODB_URI || '',
  auditDatabaseName: process.env.AUDIT_DATABASE_NAME || 'fitfactor_audit',
  jwtSecret: process.env.JWT_SECRET || 'fitfactor-development-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  auditLogIntegrityKey:
    process.env.AUDIT_LOG_INTEGRITY_KEY || 'fitfactor-development-audit-integrity-key',
  adminSignupInviteCode: process.env.ADMIN_SIGNUP_INVITE_CODE || '',
  muxTokenId: process.env.MUX_TOKEN_ID || '',
  muxTokenSecret: process.env.MUX_TOKEN_SECRET || '',
  muxWebhookSigningSecret: process.env.MUX_WEBHOOK_SIGNING_SECRET || '',
  muxWebhookToleranceSeconds: Number(process.env.MUX_WEBHOOK_TOLERANCE_SECONDS || 300),
  maxStoredMuxVideos: Number(process.env.MAX_STORED_MUX_VIDEOS || 6),
  auditRetentionDaysGeneral: Number(process.env.AUDIT_RETENTION_DAYS_GENERAL || 14),
  auditRetentionDaysSecurity: Number(process.env.AUDIT_RETENTION_DAYS_SECURITY || 30),
  auditRetentionDaysAdminChange: Number(process.env.AUDIT_RETENTION_DAYS_ADMIN_CHANGE || 30),
};

if (env.nodeEnv === 'production') {
  ['mongodbUri', 'auditMongodbUri', 'jwtSecret', 'auditLogIntegrityKey'].forEach((key) => {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}

module.exports = env;
