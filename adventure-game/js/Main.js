let canvas, canvasContext;
let blueWarrior = new Warrior();

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  colorText('Loading image for game...', canvas.width / 2, canvas.height / 2, 'white');
  loadImages();
};

function startGameAfterLoading() {
  let framesPerSecond = 30;
  setInterval(updateAll, 1000 / framesPerSecond);

  setupInput();

  loadLevel(levelOne);
}

function loadLevel(whichLevel) {
  worldGrid = [...whichLevel];
  blueWarrior.reset(warriorPic, 'Blue Warrior');
}

function updateAll() {
  moveAll();
  drawAll();
}

function moveAll() {
  blueWarrior.move();
}

function drawAll() {
  drawWorld();
  blueWarrior.draw();
}
