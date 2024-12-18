const corsOptions = {
    origin: '*', // Permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'user-token'], // Cabeçalhos permitidos
    exposedHeaders: ['X-Custom-Header'], // Cabeçalhos expostos ao cliente
    // credentials: false, // Não permite envio de cookies ou credenciais
    optionsSuccessStatus: 204 // Status padrão para respostas pré-flight bem-sucedidas
}

module.exports = {
    corsOptions
}