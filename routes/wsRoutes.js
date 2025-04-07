const uWS = require('uWebSockets.js');
const router = express.Router();

router.ws('/ws', {
    /* Quando um cliente se conecta */
    open: (ws) => {
      console.log('Cliente conectado');
      ws.send('Bem-vindo ao WebSocket!');
    },
  
    /* Quando recebe uma mensagem */
    message: (ws, message) => {
      const data = Buffer.from(message).toString();
      console.log('Mensagem recebida:', data);
  
      // Envia de volta a mesma mensagem como resposta
      ws.send(`Eco: ${data}`);
    },
  
    /* Quando a conexão é fechada */
    close: (ws, code, message) => {
      console.log('Cliente desconectado', code, Buffer.from(message).toString());
    }
});
  
module.exports = router