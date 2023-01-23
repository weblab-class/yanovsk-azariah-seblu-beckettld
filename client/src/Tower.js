export function towerSpawn(ctx, canvas, towerObj, status) {
  class Tower {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.status = status;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      let color = status == 0 ? "blue" : "yellow";
      ctx.fillStyle = color;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.fillStyle = color;
      ctx.shadowBlur = 0;
      ctx.shadowColor = color;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fill();
    }
  }

  let data = new Tower(towerObj.x, towerObj.y, towerObj.width, towerObj.height);
  //   console.log(data.width);
  data.draw(ctx);
}
