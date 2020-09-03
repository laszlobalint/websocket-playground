const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

let mouseX = 0;
let mouseY = 0;

function setupInput() {
  canvas.addEventListener('mousemove', updateMousePos);
  document.addEventListener('keydown', keyPressed);
  document.addEventListener('keyup', keyReleased);
  greenCar.setupInput(KEY_W, KEY_D, KEY_S, KEY_A);
  blueCar.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW);
}

function updateMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
}

function keySet(keyEvent, whichCar, setTo) {
  if (keyEvent.keyCode === whichCar.controlKeyLeft) {
    whichCar.keyHeld_TurnLeft = setTo;
  }
  if (keyEvent.keyCode === whichCar.controlKeyRight) {
    whichCar.keyHeld_TurnRight = setTo;
  }
  if (keyEvent.keyCode === whichCar.controlKeyUp) {
    whichCar.keyHeld_Gas = setTo;
  }
  if (keyEvent.keyCode === whichCar.controlKeyDown) {
    whichCar.keyHeld_Reverse = setTo;
  }
}

function keyPressed(evt) {
  keySet(evt, greenCar, true);
  keySet(evt, blueCar, true);
  evt.preventDefault();
}

function keyReleased(evt) {
  keySet(evt, greenCar, false);
  keySet(evt, blueCar, false);
  evt.preventDefault();
}
