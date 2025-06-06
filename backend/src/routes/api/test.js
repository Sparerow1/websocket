const router = require('express').Router();
// This file sets up a test route for the application.

router.use('/', (req, res) => {
  res.json({
    message: 'Test route is working!'})
});

module.exports = router;