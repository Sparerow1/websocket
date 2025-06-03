const express = require('express');
const webserver = require('./webserver');
const app = express();
const port = process.env.PORT || 3000;

const { WebSocketServer } = require('ws')
const sockserver = new WebSocketServer({ port: 443 })

sockserver.on('connection', (ws) => {
console.log('New client connected');

ws.on('message', (message) => {
  console.log(`Received message: ${message}`);
  // Echo the message back to the client
  ws.send(`Server received: ${message}`);
});
ws.on('close', () => {
  console.log('Client disconnected');
});
ws.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
});
}
);