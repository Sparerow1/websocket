const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(routes); // Register routes from the routes module
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});


// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);

  const errRes = {
    message: err.message,
    errors: err.errors
  };

  if (err.title === 'Server Error') {
    errRes.title = 'Server Error'
  }

  if (!isProduction) {
    errRes.stack = err.stack
  }

  res.json(errRes);
});

//export app
module.exports = app;
// const express = require('express')
// const webserver = express()
//  .use((req, res) =>
//    res.sendFile('public/websocket-client.html', { root: __dirname })
//  )
//  .listen(3000, () => console.log(`Listening on ${3000}`))
// const { WebSocketServer } = require('ws')
// const sockserver = new WebSocketServer({ port: 8080 })
// sockserver.on('connection', ws => {
//  console.log('New client connected!')
//  ws.send('connection established')
//  ws.on('close', () => console.log('Client has disconnected!'))
//  ws.on('message', data => {
//    sockserver.clients.forEach(client => {
//      console.log(`distributing message: ${data}`)
//      client.send(`${data}`)
//    })
//  })
//  ws.onerror = function () {
//    console.log('websocket error')
//  }
// })