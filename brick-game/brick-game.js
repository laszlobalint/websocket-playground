const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLUMNS = 10;
const BRICK_ROWS = 14;

let brickGrid = [];
let bricksLeft = null;
let paddleX = 400;
let ballX = 75;
let ballY = 75;
let ballSpeedX = 5;
let ballSpeedY = 7;
let mouseX = 0;
let mouseY = 0;
let canvas, canvasContext, interval;

window.onload = function () {
  canvas = document.getElementById('game-canvas');
  canvasContext = canvas.getContext('2d');
  let framesPerSecond = 30;
  interval = setInterval(updateAll, 1000 / framesPerSecond);
  canvas.addEventListener('mousemove', updateMousePosition);
  resetBricks();
  resetBall();
};

function updateMousePosition(evt) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
  paddleX = mouseX - PADDLE_WIDTH / 2;
}

function resetBricks() {
  brickGrid = new Array(BRICK_COLUMNS * BRICK_ROWS).fill(false);
  bricksLeft = 0;
  for (let i = 3 * BRICK_COLUMNS; i < BRICK_COLUMNS * BRICK_ROWS; i++) {
    brickGrid[i] = true;
    bricksLeft++;
  }
}

function updateAll() {
  moveAll();
  drawAll();
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function ballMoveHandler() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballX > canvas.width || (ballX < 0 && ballSpeedX < 0.0)) ballSpeedX *= -1;
  if (ballY > canvas.height || (ballY < 0 && ballSpeedX > 0.0)) ballSpeedY *= -1;
  if (ballY > canvas.height) {
    resetBricks();
    resetBall();
    ballSpeedY *= -1;
  }
}

function ballPaddleHandler() {
  let paddleTopY = canvas.height - PADDLE_DIST_FROM_EDGE;
  let paddleBottomY = paddleTopY + PADDLE_THICKNESS;
  let paddleLeftX = paddleX;
  let paddleRightX = paddleLeftX + PADDLE_WIDTH;

  if (ballY > paddleTopY && ballSpeedY < paddleBottomY && ballX > paddleLeftX && ballX < paddleRightX) {
    ballSpeedY *= -1;
    let centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
    let ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
    ballSpeedX = ballDistFromPaddleCenterX * 0.35;
  }
}

function ballBrickHandler() {
  const ballBrickCol = Math.floor(ballX / BRICK_W);
  const ballBrickRow = Math.floor(ballY / BRICK_H);
  const brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

  if (
    ballBrickCol >= 0 &&
    ballBrickCol < BRICK_COLUMNS &&
    ballBrickRow >= 0 &&
    ballBrickRow < BRICK_ROWS &&
    brickGrid[brickIndexUnderBall]
  ) {
    brickGrid[brickIndexUnderBall] = false;
    bricksLeft--;

    const prevBallX = ballX - ballSpeedX;
    const prevBallY = ballY - ballSpeedY;
    const prevBrickCol = Math.floor(prevBallX / BRICK_W);
    const prevBrickRow = Math.floor(prevBallY / BRICK_H);
    let bothTestsFailed = true;

    if (prevBrickCol !== ballBrickCol) {
      const adjBrickSide = rowColToArrayIndex(prevBrickCol, ballBrickRow);
      if (!brickGrid[adjBrickSide]) {
        ballSpeedX *= -1;
        bothTestsFailed = false;
      }
    }

    if (prevBrickRow !== ballBrickRow) {
      const adjBrickTopBot = rowColToArrayIndex(ballBrickCol, prevBrickRow);
      if (!brickGrid[adjBrickTopBot]) {
        ballSpeedY *= -1;
        bothTestsFailed = false;
      }
    }

    if (bothTestsFailed) {
      ballSpeedX *= -1;
      ballSpeedY *= -1;
    }
  }

  if (bricksLeft <= 0) winnerNotification();
}

function moveAll() {
  ballMoveHandler();
  ballBrickHandler();
  ballPaddleHandler();
}

function drawAll() {
  // Clear screen
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  // Draw ball
  colorCircle(ballX, ballY, 10, 'white');
  // Draw paddle
  colorRect(paddleX, canvas.height - PADDLE_DIST_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
  // Draw bricks
  drawBricks();
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
}

function rowColToArrayIndex(col, row) {
  return col + BRICK_COLUMNS * row;
}

function drawBricks() {
  for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < BRICK_COLUMNS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow);
      if (brickGrid[arrayIndex]) colorRect(BRICK_W * eachCol, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'blue');
    }
  }
}

function winnerNotification() {
  clearTimeout(interval);
  let winCanvas = document.getElementById('win-canvas');
  ctx = winCanvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.font = '36px san-serif';
  const textString = 'You have won the game! Congratulations!';
  const textWidth = ctx.measureText(textString).width;
  ctx.fillText(textString, winCanvas.width / 2 - textWidth / 2, 100);
}
