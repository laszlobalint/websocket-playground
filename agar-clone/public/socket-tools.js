const socket = io.connect('http://localhost:8080');

function init() {
  draw();
  socket.emit('init', { playerName: player.name });
}

socket.on('initReturn', (data) => {
  orbs = data.orbs;
  player.uid = data.playerUid;
  setInterval(() => {
    socket.emit('tick', {
      xVector: player.xVector,
      yVector: player.yVector,
    });
  }, 33);
});

socket.on('tock', (data) => {
  players = data.players;
});

socket.on('tickTock', (data) => {
  player.locX = data.playerX;
  player.locY = data.playerY;
});

socket.on('orbSwitch', (data) => {
  orbs.splice(data.index, 1, data.newOrb);
});

socket.on('playerDeath', (data) => {
  document.querySelector('#game-message').innerHTML = `${data.died.name} absorbed by ${data.killedBy.name}!`;
  $('#game-message').css({
    'background-color': '#00e6e6',
    opacity: 1,
  });
  $('#game-message').show();
  $('#game-message').fadeOut(5000);
});

socket.on('updateLeaderBoard', (data) => {
  document.querySelector('.leader-board').innerHTML = '';
  data.forEach((curPlayer) => {
    if (curPlayer.uid === player.uid) {
      document.querySelector('.player-score').innerHTML = curPlayer.score;
    }
    document.querySelector('.leader-board').innerHTML += `
    <li class="leaderboard-player">${curPlayer.name} - ${curPlayer.score} points</li>`;
  });
});
