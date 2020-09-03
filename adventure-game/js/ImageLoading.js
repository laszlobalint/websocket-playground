let warriorPic = document.createElement('img');
let worldPics = [];
let picsToLoad = 0;

function countLoadedImagesAndLaunchIfReady() {
  picsToLoad--;
  console.log(picsToLoad);
  if (picsToLoad == 0) startGameAfterLoading();
}

function beginLoadingImage(imgVar, fileName) {
  imgVar.onload = countLoadedImagesAndLaunchIfReady;
  imgVar.src = `images/${fileName}`;
}

function loadImageForWorldCode(worldCode, fileName) {
  worldPics[worldCode] = document.createElement('img');
  beginLoadingImage(worldPics[worldCode], fileName);
}

function loadImages() {
  let imageList = [
    { letName: warriorPic, theFile: 'warrior.png' },
    { worldType: TILE_GROUND, theFile: 'world_ground.png' },
    { worldType: TILE_WALL, theFile: 'world_wall.png' },
    { worldType: TILE_GOAL, theFile: 'world_goal.png' },
    { worldType: TILE_KEY, theFile: 'world_key.png' },
    { worldType: TILE_DOOR, theFile: 'world_door.png' },
  ];

  picsToLoad = imageList.length;

  for (let i = 0; i < imageList.length; i++) {
    if (imageList[i].letName) {
      beginLoadingImage(imageList[i].letName, imageList[i].theFile);
    } else {
      loadImageForWorldCode(imageList[i].worldType, imageList[i].theFile);
    }
  }
}
