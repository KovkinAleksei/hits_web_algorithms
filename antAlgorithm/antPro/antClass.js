import { canvas, ctx } from "./antMain.js";

export class Ant {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = Math.random() * 2 * Math.PI;
    }

    updatePosition() {
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);

        if (this.x < 0 || this.x > canvas.width) {
          this.direction = Math.PI - this.direction;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.direction = -this.direction;
        }
    }

    draw() {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
}