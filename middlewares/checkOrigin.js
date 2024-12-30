const corsAllowedOrigins = process.env.CORS_ORIGINS
const ENV = process.env.ENVIRONMENT

const checkOrigin = (req, res, next) => {
    const fetchSite = req.headers['sec-fetch-site'];
    const origin = req.headers['origin']
    console.log(fetchSite, origin);
    
    // Se a origem for a mesma (same-origin), permite a requisição
    // Se a origem estiver na lista de permitidas, permite a requisição
    // Se o ambiente for development, permite a requisição
    if (fetchSite === 'same-origin' || corsAllowedOrigins.split(',').includes(origin) || ENV === 'development') {
      return next(); // Continua o processamento da requisição
    } else {
      // Se a requisição não for same-origin, aplica regras de CORS ou bloqueia
      console.log('Requisição de origem diferente, bloqueada ou precisa de validação CORS.');
      return res.status(403).send('Acesso não permitido para essa origem.');
    }
  };
  
  module.exports = checkOrigin;