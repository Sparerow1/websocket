const router = require('express').Router();
// This file sets up a test route for the application.

router.use('/', (req, res) => {
  res.json({
    message: 'WebSocket server info',
    websocketUrl: `ws://localhost:${process.env.PORT || 3000}`,
    status: 'active'
  });
});

module.exports = router;