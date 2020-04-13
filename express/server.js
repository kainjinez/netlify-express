'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
router.get('/anotherone', (req, res) => {
  res.json({ route: req.originalUrl })
});
router.get('/', (req, res) => {
  var ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  res.writeHead(200, { 'Content-Type': 'application/json' });
  // res.write('<h1>Hello from Express.js!</h1>');
  var response = {
    ip: ip
  };
  res.write(JSON.stringify(response));
  res.end();
});

router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
