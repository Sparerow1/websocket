const app = require('./src/app');
const { port } = require('./src/config');
const { WebSocketServer } = require('ws');
const http = require('http');
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (data) => {
        try {
            const { type, roomId, message, username } = JSON.parse(data);
            
            switch (type) {
                case 'join':
                    ws.roomId = roomId;
                    ws.username = username;
                    users.set(ws, { username, roomId });
                    
                    // Initialize room if doesn't exist
                    if (!chatRooms.has(roomId)) {
                        chatRooms.set(roomId, []);
                    }
                    
                    // Notify others in room
                    broadcastToRoom(roomId, {
                        type: 'user-joined',
                        username,
                        timestamp: new Date().toISOString()
                    }, ws);
                    
                    // Send confirmation to joining user
                    ws.send(JSON.stringify({
                        type: 'joined',
                        roomId,
                        message: `Joined room: ${roomId}`
                    }));
                    break;

                case 'message':
                    if (ws.roomId && ws.username) {
                        const messageData = {
                            id: Date.now(),
                            type: 'message',
                            username: ws.username,
                            message,
                            roomId: ws.roomId,
                            timestamp: new Date().toISOString()
                        };

                        // Store message
                        chatRooms.get(ws.roomId).push(messageData);

                        // Broadcast to all users in room
                        broadcastToRoom(ws.roomId, messageData);
                    }
                    break;

                case 'leave':
                    if (ws.roomId && ws.username) {
                        broadcastToRoom(ws.roomId, {
                            type: 'user-left',
                            username: ws.username,
                            timestamp: new Date().toISOString()
                        }, ws);
                    }
                    break;
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format'
            }));
        }
    });

    ws.on('close', () => {
        if (ws.roomId && ws.username) {
            broadcastToRoom(ws.roomId, {
                type: 'user-left',
                username: ws.username,
                timestamp: new Date().toISOString()
            }, ws);
        }
        users.delete(ws);
        console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Helper function to broadcast to room
function broadcastToRoom(roomId, message, excludeWs = null) {
    wss.clients.forEach(client => {
        if (client.roomId === roomId && client !== excludeWs && client.readyState === 1) {
            client.send(JSON.stringify(message));
        }
})};



server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`WebSocket server is running on ws://localhost:${port}`);
});

// Export the server for testing purposes
module.exports = server;