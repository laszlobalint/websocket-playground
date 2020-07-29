function draw() {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);

  const cameraX = -player.locX + canvas.width / 2;
  const cameraY = -player.locY + canvas.height / 2;
  context.translate(cameraX, cameraY);

  players.forEach((p) => {
    if (p.locX && p.locY && p.radius && p.color) {
      context.beginPath();
      context.fillStyle = p.color;
      context.arc(p.locX, p.locY, p.radius, 0, Math.PI * 2);
      context.fill();
      context.lineWidth = 3;
      context.strokeStyle = p.stroke;
      context.stroke();
    }
  });

  orbs.forEach((orb) => {
    if (orb.locX && orb.locY && orb.radius && orb.color) {
      context.beginPath();
      context.fillStyle = orb.color;
      context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
      context.fill();
    }
  });

  requestAnimationFrame(draw);
}

canvas.addEventListener('mousemove', (event) => {
  const mousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
  const angleDeg = (Math.atan2(mousePosition.y - canvas.height / 2, mousePosition.x - canvas.width / 2) * 180) / Math.PI;

  if (angleDeg >= 0 && angleDeg < 90) {
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector;
  player.yVector = yVector;
});
