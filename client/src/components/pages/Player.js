export function playerMovement(
  ctx,
  canvas,
  playerObj,
  playerRight,
  playerLeft,
  playerUp,
  playerDown
) {
  class Player {
    constructor(x, y, rad) {
      this.x = x;
      this.y = y;
      this.rad = rad;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
    }
  }

  // // Check for wall collisions
  // if (playerRight && playerObj.x < canvas.width - playerObj.rad)
  //   playerObj.x += 1.5;
  // if (playerLeft && playerObj.x > playerObj.rad) playerObj.x -= 1.5;
  // if (playerUp && playerObj.y > playerObj.rad) playerObj.y -= 1.5;
  // if (playerDown && playerObj.y < canvas.height - playerObj.rad)
  //   playerObj.y += 1.5;

  let data = new Player(playerObj.x, playerObj.y, playerObj.rad);
  data.draw(ctx);
}
