const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret); // Valida o token
    req.user = decoded; // Adiciona informações do usuário ao objeto `req`
    next(); // Continua para a próxima middleware/rota
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticateToken };
