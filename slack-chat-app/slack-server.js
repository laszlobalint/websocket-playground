const express = require('express');
const app = express();
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');
app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
  const nsData = namespaces.map((ns) => {
    return {
      image: ns.image,
      endpoint: ns.endpoint,
    };
  });
  socket.emit('nsList', nsData);
});

namespaces.forEach((ns) => {
  io.of(ns.endpoint).on('connection', (nsSocket) => {
    nsSocket.emit('nsRoomLoad', ns.rooms);

    nsSocket.on('joinRoom', (roomToJoin) => {
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(ns, roomToLeave);

      nsSocket.join(roomToJoin);

      const nsRoom = ns.rooms.find((room) => {
        return room.title === roomToJoin;
      });
      nsSocket.emit('historyCatchUp', nsRoom.history);
      updateUsersInRoom(ns, roomToJoin);
    });

    nsSocket.on('messageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: new Date().toLocaleString(),
        username: nsSocket.handshake.query.username,
        avatar: nsSocket.handshake.query.avatar,
      };
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      const nsRoom = ns.rooms.find((room) => {
        return room.title === roomTitle;
      });
      nsRoom.addMessage(fullMsg);
      io.of(ns.endpoint).to(roomTitle).emit('messageToClients', fullMsg);
    });
  });
});

function updateUsersInRoom(namespace, roomToJoin) {
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((error, clients) => {
      io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length);
    });
}
