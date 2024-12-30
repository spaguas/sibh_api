const corsAllowedOrigins = process.env.CORS_ORIGINS
const ENV = process.env.ENVIRONMENT
const FIXED_TOKEN = 'DIEGO'

// const checkOrigin = (req, res, next) => {
//     const fetchSite = req.headers['sec-fetch-site'];
//     const origin = req.headers['origin']
//     console.log(fetchSite, origin);
    
//     // Se a origem for a mesma (same-origin), permite a requisição
//     // Se a origem estiver na lista de permitidas, permite a requisição
//     // Se o ambiente for development, permite a requisição
//     if (corsAllowedOrigins.split(',').includes(origin) || ENV === 'development') {
//       return next(); // Continua o processamento da requisição
//     } else {
//       // Se a requisição não for same-origin, aplica regras de CORS ou bloqueia
//       console.log('Requisição de origem diferente, bloqueada ou precisa de validação CORS.');
//       return res.status(403).send('Acesso não permitido para essa origem.');
//     }
// };

const checkOriginIP = (req) => {
  let clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  clientIP = clientIP.replaceAll('::ffff:', '');
  console.log(clientIP);
  
  return corsAllowedOrigins.includes(clientIP);
};

// Middleware para verificar o token fixo
const verifyFixedToken = (req) => {
  const token = req.headers['x-api-token']; // Token fixo no cabeçalho X-API-TOKEN
  console.log(token);
  
  return token === FIXED_TOKEN;
};

// Middleware para garantir que a requisição tenha um dos critérios válidos (IP ou token)
const validateAccess = (req, res, next) => {
  if (checkOriginIP(req) || verifyFixedToken(req) || ENV === 'development') {
    return next(); // Se IP ou token ou ENV forem válidos, continua a requisição
  } else {
    return res.status(403).send('Acesso negado: IP ou token ou ambiente inválido.');
  }
};
  
module.exports = {
  validateAccess
  // checkOrigin
};