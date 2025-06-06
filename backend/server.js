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
      const message = JSON.parse(data);
      console.log('Received message:', message);

      // broadcast the message to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          client.send(message.data);
        }
      });

    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({  
        type: 'error',  
        message: 'An error occurred while processing your message.',
        timestamp: new Date().toISOString()
      }));
    }
  })

  // handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('ping', () => {
    console.log('Received ping from client');
    ws.pong(); // respond to ping with pong
  });
  
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`WebSocket server is running on ws://localhost:${port}`);
});

// Export the server for testing purposes
module.exports = server;