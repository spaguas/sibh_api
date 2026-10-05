
require('dotenv').config()
const port = process.env.HTTP_PORT

//rede de segurança: loga e segue vivo em vez de derrubar o processo.
//cobre erros que não passam pelo ciclo request/response do Express (ex: eventos do ioredis)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const app = require('./app')

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});