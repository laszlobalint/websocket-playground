let canvas, canvasContext;
let blueCar = new Car();
let greenCar = new Car();

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  colorText('Loading images for game...', canvas.width / 2, canvas.height / 2, 'white');
  loadImages();
};

function startGameAfterLoading() {
  let framesPerSecond = 30;
  setInterval(updateAll, 1000 / framesPerSecond);
  setupInput();
  loadLevel(levelList[levelCurrent]);
}

function nextLevel() {
  levelCurrent++;
  if (levelCurrent >= levelList.length) levelCurrent = 0;
  loadLevel(levelList[levelCurrent]);
}

function loadLevel(whichLevel) {
  trackGrid = [...whichLevel];
  blueCar.reset(firstCarPicture, 'Blue Storm');
  greenCar.reset(secondCarPicture, 'Green Machine');
}

function updateAll() {
  moveAll();
  drawAll();
}

function moveAll() {
  blueCar.move();
  greenCar.move();
}

function drawAll() {
  drawTracks();
  blueCar.draw();
  greenCar.draw();
}
