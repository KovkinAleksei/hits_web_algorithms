import { canvas, ctx, map, pheromoneMap, speed, size } from "./antMain.js";

const pheromoneStrength = 1;
const pheromoneDestroy = 0.6;

export class Ant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = Math.random() * 2 * Math.PI;
        this.pheromones = [];
    }

    updatePosition() {
        for (let i = 0; i < size; i++){ 
            for (let j = 0; j < size; j++){
                pheromoneMap[i][j] = pheromoneMap[i][j] * 0.6;
            }
        }
        if (this.x > 0 && this.x < canvas.width && this.y > 0 && this.y < canvas.height){
            console.log ({x: Math.floor(this.x / 10), y: Math.floor(this.y / 10)});
            this.pheromones.push({ x: this.x, y: this.y, time: 100 });
            pheromoneMap[Math.floor(this.x / 10)][Math.floor(this.y / 10)] = 1;
        }

        this.x += speed * Math.cos(this.direction);
        this.y += speed * Math.sin(this.direction);

        if (this.x < 0 || this.x > canvas.width) {
            this.direction = Math.PI - this.direction;
        }

        if (this.y < 0 || this.y > canvas.height) {
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

        for (let i = 0; i < this.pheromones.length; i++) {
            this.pheromones[i].time--;
            if (this.pheromones[i].time <= 0) {
                this.pheromones.splice(i, 1);
                i--;
            }
        }
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    drawPheromones() {
        for (let i = 0; i < this.pheromones.length; i++) {
            ctx.fillStyle = "rgba(255, 0, 0, " + (this.pheromones[i].time / 100) + ")";
            ctx.beginPath();
            ctx.arc(this.pheromones[i].x, this.pheromones[i].y, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}