const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/jwt');

function generateToken(userId) {
  const payload = { id: userId };
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

module.exports = { generateToken };
