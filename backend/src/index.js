const express = require('express');
const webserver = require('./webserver');
const app = express();
const port = process.env.PORT || 3000;

const { WebSocketServer } = require('ws')
const sockserver = new WebSocketServer({ port: 443 })

