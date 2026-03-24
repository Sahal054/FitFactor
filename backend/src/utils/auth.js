const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signAdminToken(adminUser) {
  return jwt.sign(
    {
      sub: String(adminUser._id),
      username: adminUser.username,
      role: adminUser.role,
      type: 'admin',
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  );
}

module.exports = {
  signAdminToken,
};
