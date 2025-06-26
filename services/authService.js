const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/jwt');

function generateToken(user,roles) {
  const payload = {id: user.id, name:user.name, email:user.email, roles:user.roles.map(x=>x.name)};
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
}

module.exports = { generateToken };
