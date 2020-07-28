const express = require('express');
const helmet = require('helmet');
const socketio = require('socket.io');
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(helmet());
const expressServer = app.listen(8080);
const io = socketio(expressServer);

module.exports = {
  app,
  io,
};
