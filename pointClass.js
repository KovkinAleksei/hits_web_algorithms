import { ctx } from "./main.js";

export class Point {

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    draw(color = 'rgb(0, 0, 0)', radiusOffset = 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + radiusOffset, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

}