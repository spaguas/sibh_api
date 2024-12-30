const corsAllowedOrigins = process.env.CORS_ORIGINS
const ENV = process.env.ENVIRONMENT


const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'user-token', 'user-email'], // Cabeçalhos permitidos
    exposedHeaders: ['X-Custom-Header'], // Cabeçalhos expostos ao cliente
    optionsSuccessStatus: 204 // Status padrão para respostas pré-flight bem-sucedidas
}

const restrictedCors = {
    origin: (origin, callback) => {        
        //APENAS ORIGINS ESPECIFICAS OU SE FOR DEV..
        if (corsAllowedOrigins.split(',').includes(origin) || ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error("Acesso não permitido para esta origem."));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'user-token', 'user-email'], // Cabeçalhos permitidos
    exposedHeaders: ['X-Custom-Header'], // Cabeçalhos expostos ao cliente
    optionsSuccessStatus: 204 // Status padrão para respostas pré-flight bem-sucedidas
}

module.exports = {
    corsOptions,
    restrictedCors,
}