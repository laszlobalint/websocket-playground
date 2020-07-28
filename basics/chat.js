const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
  socket.emit('messageFromServer', { data: 'Welcome to the Socket.IO Server!' });
  socket.on('messageToServer', (newMessage) => {
    console.log(newMessage);
  });
  socket.join('tempRoom');
  io.to('tempRoom').emit('joined', `${socket.id} says: You have joined the TempRoom0!`);
});

io.of('/admin').on('connection', (socket) => {
  console.log('Logged to admin namespace...');
  io.of('/admin').emit('welcome', 'Welcome to the admin channel!');
});
