const express = require('express');
const cluster = require('cluster');
const net = require('net');
const socketIO = require('socket.io');
const helmet = require('helmet');
const io_redis = require('socket.io-redis');
const farmhash = require('farmhash');
const socketMain = require('./socket-main');
const expressMain = require('./express-main');

const PORT = 8181;
const NUM_PROCESSES = require('os').cpus().length;

if (cluster.isMaster) {
  const workers = [];

  // Helper function for spawning worker at index 'i'.
  const spawn = (i) => {
    workers[i] = cluster.fork();
    // Restart worker on crush or exit.
    workers[i].on('exit', function (code, signal) {
      spawn(i);
    });
  };

  // Spawn workers.
  for (let i = 0; i < NUM_PROCESSES; i++) {
    spawn(i);
  }

  // Helper function for getting a worker index based on IP address.
  // The way it works  by converting the IP address to a number by removing
  // non-numeric characters, then compressing it to the number of slots it has.
  // Compared against "real" hashing (from the sticky-session code) and
  // "real" IP number conversion, this function is on par in terms of
  // worker index distribution only much faster.
  const worker_index = (ip, len) => farmhash.fingerprint32(ip) % len;

  // In this case, going to start up a TCP connection via the internet
  // module instead OF the HTTP module. Express will use HTTP, but needed an
  // an independent TCP port open for cluster to work. This is the port that
  // will face the internet.
  const server = net.createServer({ pauseOnConnect: true }, (connection) => {
    // Received a connection and need to pass it to the appropriate worker.
    // Get the worker for this connection's source IP and pass it the connection.
    const worker = workers[worker_index(connection.remoteAddress, NUM_PROCESSES)];
    worker.send('sticky-session:connection', connection);
  });
  server.listen(PORT);
  console.log(`Master listening on port ${PORT}...`);
} else {
  // Not using a port here because the master listens on it.
  const app = express();
  app.use(express.static(__dirname + '/public'));
  app.use(helmet());
  // Do not expose internal server to the outside world.
  const server = app.listen(0, 'localhost');
  const io = socketIO(server);

  // Tell Socket.IO to use the Redis adapter. The Redis
  // server is assumed to be on 'localhost:6379'. No need to
  // specify them explicitly unless needed to change them.
  // Command: redis-cli monitor
  io.adapter(io_redis({ host: 'localhost', port: 6379 }));

  // Place for using Socket.IO middleware for authorization and so on.
  // On connection send the socket over to the module with socket tools.
  io.on('connection', function (socket) {
    socketMain(io, socket);
    console.log(`Connected to worker with ID: ${cluster.worker.id}`);
  });

  // Listen only to the messages sent from the master worker.
  process.on('message', function (message, connection) {
    if (message !== 'sticky-session:connection') return;

    // Emulate a connection event on the server by emitting
    // the event with the connection the master sent here.
    server.emit('connection', connection);

    connection.resume();
  });
}
