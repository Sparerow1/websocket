const app = require('../../app');

const router = require('express').Router();

const chatRooms = new Map();
const users = new Map();

app.get('/api/rooms', (req, res) => {
    const rooms = Array.from(chatRooms.keys()).map(roomId => ({
        id: roomId,
        name: roomId,
        messageCount: chatRooms.get(roomId).length
    }));
    res.json({ rooms });
});

app.post('/api/rooms', (req, res) => {
    const { roomName } = req.body;
    if (!chatRooms.has(roomName)) {
        chatRooms.set(roomName, []);
        res.json({ success: true, roomName });
    } else {
        res.status(400).json({ error: 'Room already exists' });
    }
});

app.get('/api/rooms/:roomId/messages', (req, res) => {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const messages = chatRooms.get(roomId) || [];
    const paginatedMessages = messages.slice(offset, offset + parseInt(limit));
    
    res.json({ 
        messages: paginatedMessages,
        total: messages.length,
        hasMore: messages.length > offset + parseInt(limit)
    });
});

app.delete('/api/rooms/:roomId', (req, res) => {
    const { roomId } = req.params;
    if (chatRooms.has(roomId)) {
        chatRooms.delete(roomId);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
});

module.exports = router;