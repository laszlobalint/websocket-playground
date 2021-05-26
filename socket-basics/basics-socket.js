const http = require('http');
const socketio = require('socket.io');

const server = http.createServer((req, res) => {
  res.end('Connected...');
});

const io = socketio(server);

io.on('connection', (socket, req) => {
  socket.emit('intro', 'Welcome to the Socket.IO server!');
  socket.on('message', (msg) => {
    console.log(msg);
  });
});

server.listen(8000);
