const app = require('./src/app');
const { port } = require('./src/config');
const { WebSocketServer } = require('ws');
const http = require('http');
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {  
  console.log('New Client Connected');

  // send a welcome message to the newly connected client
  ws.send(JSON.stringify({  
    type: 'connection',  
    message: 'Welcome to the WebSocket server!',
    timestamp: new Date().toISOString()
  }));  

  // handle incoming messages from clients
  ws.on('message', (data) => {
    try { 

    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({  
        type: 'error',  
        message: 'An error occurred while processing your message.',
        timestamp: new Date().toISOString()
      }));
    }
  })
  
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});