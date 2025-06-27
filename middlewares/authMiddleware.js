const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
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

function authorize(allowedRoles = []){
  return (req, res, next) =>{
    const userRole = req.user?.roles || []
    
    if(!userRole.includes('dev') && !userRole.some(r=> allowedRoles.includes(r))){
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next()
  }
}

//Caso token válido, retornar o usuario, se nao, next(). Nada de forbidden..
function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, jwtSecret); // Valida o token
      req.user = decoded; // Adiciona informações do usuário ao objeto `req`
    } catch (err) {
      // Token inválido → segue sem req.user
      console.warn("Token inválido em optionalAuth:", err.message);
    }
  }

  next(); // segue com ou sem user
}

//caso autorizado, retorna um indicativo de autorização, else, next(). Nada de forbidden..
function optionalAuthorize(allowedRoles = []){
  return (req, res, next) =>{
    const userRole = req.user?.roles || []
    
    if(userRole.includes('dev') || userRole.some(r=> allowedRoles.includes(r))){
      req.user.authorized = true //avisando que ta autorizado
    }

    next()
  }
}


module.exports = { authenticateToken,authorize,optionalAuthenticateToken,optionalAuthorize };
