const router = require('express').Router();
const testRouter = require('./test');
const websocketStatusRouter = require('./websocketStatus');
const chatRoomsRouter = require('./chatroom');
// This file sets up the main API routes for the application. 

router.use('/test', testRouter);
router.use('/websocketStatus', websocketStatusRouter);
router.use('/', chatRoomsRouter);

// Catch unhandled requests and forward to error handler.
router.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Error formatter
router.use((err, _req, res, _next) => {
  res.status(err.status || 500);

  const errRes = {
    message: err.message,
    errors: err.errors
  };

  if (err.title === 'Server Error') {
    errRes.title = 'Server Error';
  }

  if (process.env.NODE_ENV !== 'production') {
    errRes.stack = err.stack;
  }

  res.json(errRes);
});
// Export the router
module.exports = router;
// This file sets up the main API routes for the application.