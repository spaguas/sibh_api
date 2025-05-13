const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/jwt');

function generateToken(userId,roles) {
  const payload = { sub: userId, roles:roles };
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

module.exports = { generateToken };
