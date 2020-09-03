const WORLD_W = 50;
const WORLD_H = 50;
const WORLD_GAP = 2;
const WORLD_COLS = 16;
const WORLD_ROWS = 12;
const TILE_GROUND = 0;
const TILE_WALL = 1;
const TILE_PLAYERSTART = 2;
const TILE_GOAL = 3;
const TILE_KEY = 4;
const TILE_DOOR = 5;

let levelOne =  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 1, 1, 1, 1,
				 1, 0, 4, 0, 4, 0, 1, 0, 2, 0, 1, 0, 1, 4, 4, 1,
				 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 5, 1, 5, 1, 1,
				 1, 1, 1, 5, 1, 1, 1, 0, 4, 0, 1, 0, 0, 0, 1, 1,
				 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 1,
				 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1,
				 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 0, 1, 1,
				 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1,
				 1, 0, 5, 0, 5, 0, 5, 0, 3, 0, 1, 1, 1, 1, 1, 1,
				 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
				 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

let worldGrid = [];

function returnTileTypeAtColRow(col, row) {
  if (col >= 0 && col < WORLD_COLS && row >= 0 && row < WORLD_ROWS) {
    let worldIndexUnderCoord = rowColToArrayIndex(col, row);
    return worldGrid[worldIndexUnderCoord];
  } else {
    return WORLD_WALL;
  }
}

function getTileIndexAtPixelCoord(atX, atY) {
  let warriorWorldCol = Math.floor(atX / WORLD_W);
  let warriorWorldRow = Math.floor(atY / WORLD_H);
  let worldIndexUnderWarrior = rowColToArrayIndex(warriorWorldCol, warriorWorldRow);

  if (warriorWorldCol >= 0 && warriorWorldCol < WORLD_COLS && warriorWorldRow >= 0 && warriorWorldRow < WORLD_ROWS) {
    return worldIndexUnderWarrior;
  } 
  return undefined;
} 

function rowColToArrayIndex(col, row) {
  return col + WORLD_COLS * row;
}

function tileTypeHasTransparency(checkTileType) {
  return checkTileType == TILE_GOAL || checkTileType == TILE_KEY || checkTileType == TILE_DOOR;
}

function drawWorld() {
  let arrayIndex = 0;
  let drawTileX = 0;
  let drawTileY = 0;
  for (let eachRow = 0; eachRow < WORLD_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < WORLD_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow);
      let tileKindHere = worldGrid[arrayIndex];
      let useImg = worldPics[tileKindHere];

      if (tileTypeHasTransparency(tileKindHere)) {
        canvasContext.drawImage(worldPics[TILE_GROUND], drawTileX, drawTileY);
      }
      canvasContext.drawImage(useImg, drawTileX, drawTileY);
      drawTileX += WORLD_W;
      arrayIndex++;
    } 
    drawTileY += WORLD_H;
    drawTileX = 0;
  } 
} 
