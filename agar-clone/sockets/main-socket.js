const io = require('../servers').io;
const checkForOrbCollisions = require('./check-collisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./check-collisions').checkForPlayerCollisions;

const PlayerConfiguration = require('./classes/PlayerConfiguration');
const PlayerPublicData = require('./classes/PlayerPublicData');
const Player = require('./classes/Player');
const Orb = require('./classes/Orb');

let orbs = [];
let players = [];
let settings = {
  defaultOrbs: 5000,
  defaultSpeed: 8,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 3000,
  worldHeight: 3000,
};

initGame();

setInterval(() => {
  checkPlayersLocation();
  if (players.length > 0) {
    io.to('game').emit('tock', {
      players,
    });
  }
}, 33);

io.sockets.on('connect', (socket) => {
  let player = {};

  socket.on('init', (data) => {
    socket.join('game');
    let playerConfig = new PlayerConfiguration(settings);
    let playerData = new PlayerPublicData(data.playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);
    players.push(playerData);

    socket.emit('initReturn', {
      orbs,
      playerUid: player.playerData.uid,
    });

    setInterval(() => {
      socket.emit('tickTock', {
        playerX: player.playerData.locX,
        playerY: player.playerData.locY,
      });
    }, 33);
  });

  socket.on('tick', (data) => {
    speed = player.playerConfig.speed;
    xV = player.playerConfig.xVector = data.xVector;
    yV = player.playerConfig.yVector = data.yVector;

    if ((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth && xV > 0)) {
      player.playerData.locY -= speed * yV;
    } else if ((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight && yV < 0)) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }

    let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings);
    capturedOrb
      .then((data) => {
        // If promise resolves a collision with orb has happened.
        const orbData = { index: data, newOrb: orbs[data] };
        io.sockets.emit('updateLeaderBoard', getLeaderBoard());
        io.sockets.emit('orbSwitch', orbData);
      })
      .catch(() => {
        // If promise rejects no collision with orb has happened.
      });

    let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.playerData.uid);
    playerDeath
      .then((data) => {
        // If promise resolves a collision with a player has happened.
        io.sockets.emit('updateLeaderBoard', getLeaderBoard());
        io.sockets.emit('playerDeath', data);
      })
      .catch(() => {
        // If promise rejects no collision with a player has happened.
      });
  });
  socket.on('disconnect', (data) => {
    if (player.playerData) {
      players.forEach((curPlayer, i) => {
        if (curPlayer.uid === player.playerData.uid) players.splice(i, 1);
        io.sockets.emit('updateLeaderBoard', getLeaderBoard());
      });
    }
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

function checkPlayersLocation() {
  players.forEach((p) => {
    if (!p.locX || !p.locY) {
      p.locX = Math.floor(settings.worldWidth * Math.random() + 100);
      p.locY = Math.floor(settings.worldHeight * Math.random() + 100);
    }
  });
}

function getLeaderBoard() {
  players.sort((a, b) => {
    return b.score - a.score;
  });
  return players.map((curPlayer) => {
    return {
      name: curPlayer.name,
      score: curPlayer.score,
      uid: curPlayer.uid,
    };
  });
}

module.exports = io;
