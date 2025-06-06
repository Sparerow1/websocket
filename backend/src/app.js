const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { environment } = require('./config');
const path = require('path');
const isProduction = environment === 'production';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

app.use(routes); // Register routes from the routes module

//  Catch unhandled requests and forward to error handler.
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