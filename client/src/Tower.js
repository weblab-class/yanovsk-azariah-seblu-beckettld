export function towerSpawn(ctx, canvas, towerObj) {
  class Tower {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 1;
      ctx.fillStyle = "blue";
      ctx.shadowBlur = 0;
      ctx.shadowColor = "blue";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fill();
    }
  }

  let data = new Tower(towerObj.x, towerObj.y, towerObj.width, towerObj.height);
  //   console.log(data.width);
  data.draw(ctx);
}
