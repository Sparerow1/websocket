const router = require('express').Router();

const chatRooms = new Map();
const users = new Map();

// GET /api/rooms - Get all rooms
router.get('/rooms', (req, res) => {
    const rooms = Array.from(chatRooms.keys()).map(roomId => ({
        id: roomId,
        name: roomId,
        messageCount: chatRooms.get(roomId).length
    }));
    res.json({ rooms });
});

// POST /api/rooms - Create new room
router.post('/rooms', (req, res) => {

    const { roomName } = req.body;
    if (!chatRooms.has(roomName)) {
        chatRooms.set(roomName, []);
        res.json({ success: true, roomName });
    } else {
        res.status(400).json({ error: 'Room already exists' });
    }
});

router.post('/rooms/:roomId/messages', (req, res) => {
    const { roomId } = req.params;
    const { userId, content } = req.body;

    if (!chatRooms.has(roomId)) {
        return res.status(404).json({ error: 'Room not found' });
    }

    if (!users.has(userId)) {
        return res.status(400).json({ error: 'User not found' });
    }

    const message = {
        userId,
        content,
        timestamp: new Date().toISOString()
    };

    chatRooms.get(roomId).push(message);
    
    res.json({ success: true, message });
});

// GET /api/rooms/:roomId/messages - Get messages from specific room
router.get('/rooms/:roomId/messages', (req, res) => {
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

// DELETE /api/rooms/:roomId - Delete specific room
router.delete('/rooms/:roomId', (req, res) => {
    const { roomId } = req.params;
    if (chatRooms.has(roomId)) {
        chatRooms.delete(roomId);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
});

module.exports = router;