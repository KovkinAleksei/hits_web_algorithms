import { canvas, ctx, map, speed } from "./antMain.js";

export class Ant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = Math.random() * 2 * Math.PI;
    }

    updatePosition() {
        this.x += speed * Math.cos(this.direction);
        this.y += speed * Math.sin(this.direction);

        if (this.x < 0 || this.x > canvas.width) {
            console.log(this.direction);
            this.direction = Math.PI - this.direction;
        }

        if (this.y < 0 || this.y > canvas.height) {
            console.log(this.direction);
            this.direction = - this.direction;
        }

        if (this.x > 0 && this.x < canvas.width && this.y > 0 && this.y < canvas.height) {
            if (map[Math.floor(this.x / 10)][Math.floor(this.y / 10)] === 1){
                if (this.direction < 0) {
                    this.direction = Math.PI - this.direction;
                }
                else {
                    this.direction = - this.direction;
                }
            }
        }
    }

    draw() {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
}