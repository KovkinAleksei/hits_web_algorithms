import { canvas, ctx, map, pheromoneMap, speed, size, foodPositions, sizePixel, antColony, pheromoneWithFoodMap } from "./antMain.js";

const foodSearchRadius = 10;
const searchRadius = 10;

export class Ant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = Math.random() * 2 * Math.PI;
        this.pheromones = [];
        this.isCarryingFood = false;
        this.timeWithOutFood = 1;
        this.pheromoneStrength = 3;
        this.pheromoneWay = [];
    }

    updatePosition() {
        this.x += speed * Math.cos(this.direction);
        this.y += speed * Math.sin(this.direction);
        this.pheromoneWay.push({x: Math.floor(this.x / sizePixel), y: Math.floor(this.y / sizePixel)});

        if (!this.isCarryingFood) {
            this.timeWithOutFood++;
            if (this.timeWithOutFood > 200) {
                if (this.pheromoneStrength > 0.01){
                    this.pheromoneStrength *= 0.98;
                }
            } 
            this.followFood(foodPositions);
        } else {
            this.timeWithOutFood++;
            if (this.timeWithOutFood > 200) {
                if (this.pheromoneStrength > 0.01){
                    this.pheromoneStrength *= 0.98;
                }
            }
            this.followHome();
        }

        for (let i = 0; i < this.pheromones.length; i++) {
            this.pheromones[i].time--;
            if (this.pheromones[i].time <= 0) {
                this.pheromones.splice(i, 1);
                i--;
            }
        }

        if (this.x > 0 && this.x < canvas.width && this.y > 0 && this.y < canvas.height){
            this.pheromones.push({ x: this.x, y: this.y, time: 25 });
            if (!this.isCarryingFood){
                if (pheromoneMap[Math.floor(this.x / sizePixel)][Math.floor(this.y / sizePixel)] < this.pheromoneStrength / this.timeWithOutFood * 2){
                    pheromoneMap[Math.floor(this.x / sizePixel)][Math.floor(this.y / sizePixel)] = this.pheromoneStrength / this.timeWithOutFood * 2; 
                }
            } else {
                if (pheromoneWithFoodMap[Math.floor(this.x / sizePixel)][Math.floor(this.y / sizePixel)] < this.pheromoneStrength / this.timeWithOutFood * 2){
                    pheromoneWithFoodMap[Math.floor(this.x / sizePixel)][Math.floor(this.y / sizePixel)] = this.pheromoneStrength / this.timeWithOutFood * 2; 
                }
            }
        }
    }

    draw() {
        ctx.fillStyle = this.isCarryingFood ? "green" : "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, 2 * Math.PI);
        ctx.fill();
    }
    
    drawPheromones() {
        for (let i = 0; i < this.pheromones.length; i++) {
            ctx.fillStyle = this.isCarryingFood ? "rgba(0, 255, 0, " + (this.pheromones[i].time / 25) + ")" : "rgba(255, 0, 0, " + (this.pheromones[i].time / 25) + ")";
            ctx.beginPath();
            ctx.arc(this.pheromones[i].x, this.pheromones[i].y, 0.6, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    findFood(foodPositions) {
        let closestFood = null;
        let closestDistance = Infinity;
        for (let i = 0; i < foodPositions.length; i++) {
            let nowX =  Math.floor(this.x / sizePixel);
            let nowY =  Math.floor(this.y / sizePixel);
            let distance = findDistance(foodPositions[i].x, foodPositions[i].y, nowX, nowY);
            if (distance < closestDistance && distance <= foodSearchRadius) {
                closestDistance = distance;
                closestFood = foodPositions[i];
            }
        }
        return closestFood;
    }

    resetAnt(){
        this.x = antColony.x;
        this.y = antColony.y;
        this.direction = Math.random() * 2 * Math.PI;
        this.pheromones = [];
        this.isCarryingFood = false;
        this.timeWithOutFood = 1;
        this.pheromoneStrength = 2;
        this.pheromoneWay = [];
    }

    followFood(foodPositions) {
        let food = this.findFood(foodPositions);
        let currentCellX = Math.floor(this.x / sizePixel);
        let currentCellY = Math.floor(this.y / sizePixel);

        if (food && !this.isCarryingFood) {
            let dx = food.x - currentCellX;
            let dy = food.y - currentCellY;
            this.pheromoneStrength = 3;
            this.direction = Math.atan2(dy, dx);
        } else {
            const startX = Math.max(0, currentCellX - searchRadius);
            const endX = Math.min(size - 1, currentCellX + searchRadius);
            const startY = Math.max(0, currentCellY - searchRadius);
            const endY = Math.min(size - 1, currentCellY + searchRadius);

            let maxPheromone = 0;
            let bestDirection = null;
            let possibbleDirection = null;
            let newCoordinate = null;

            for (let x = startX; x <= endX; x++) {
                for (let y = startY; y <= endY; y++) {
                    const pheromoneLevel = pheromoneWithFoodMap[x][y];
                    if (pheromoneLevel > maxPheromone) {
                        maxPheromone = pheromoneLevel;
                        let dx = x - currentCellX;
                        let dy = y - currentCellY;
                        bestDirection = Math.atan2(dy, dx);
                        newCoordinate = {x: Math.floor((this.x + speed * Math.cos(bestDirection)) / sizePixel), y: Math.floor((this.y + speed * Math.sin(bestDirection)) / sizePixel)};
                        if (!checker(newCoordinate, this.pheromoneWay)){
                            possibbleDirection = bestDirection;
                        }
                    }
                }
            }
            if (possibbleDirection === null || Math.random() < 0.1) {
                let index = 0;
                do {
                    index++;
                    possibbleDirection = this.direction + (Math.random() - 0.5) * 0.5;
                    newCoordinate = {x: Math.floor((this.x + speed * Math.cos(possibbleDirection)) / sizePixel), y: Math.floor((this.y + speed * Math.sin(possibbleDirection)) / sizePixel)};
                    if (!checkWalls(newCoordinate)){
                        this.direction = possibbleDirection;
                        break;
                    }
                        
                    else if (index === 200){
                        if (this.direction < 0) {
                            this.direction = Math.PI - this.direction;
                        } else {
                            this.direction = -this.direction;
                        }
                        break;
                    }
                } while(true);
            } else {
                this.direction = possibbleDirection;
            }
        }

        if (food){
            let dx = food.x - currentCellX;
            let dy = food.y - currentCellY;
            if (Math.abs(dx) < 1 && Math.abs(dy) < 1) { 
                this.isCarryingFood = true;
                this.timeWithOutFood = 1;
                this.pheromoneStrength = 3;
                this.pheromoneWay = [];
            } 
        }   
    } 

    followHome() {
        let currentCellX = Math.floor(this.x / sizePixel);
        let currentCellY = Math.floor(this.y / sizePixel);

        const startX = Math.max(0, currentCellX - searchRadius);
        const endX = Math.min(size - 1, currentCellX + searchRadius);
        const startY = Math.max(0, currentCellY - searchRadius);
        const endY = Math.min(size - 1, currentCellY + searchRadius);
         
        let maxPheromone = 0;
        let bestDirection = null;
        let possibbleDirection = null;
        let newCoordinate = null;

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                if (x === currentCellX && y === currentCellY) {
                    continue;
                }

                const pheromoneLevel = pheromoneMap[x][y];
                if (pheromoneLevel > maxPheromone) {
                    maxPheromone = pheromoneLevel;
                    let dx = x - currentCellX;
                    let dy = y - currentCellY;
                    bestDirection = Math.atan2(dy, dx);
                    newCoordinate = {x: Math.floor((this.x + speed * Math.cos(bestDirection)) / sizePixel), y: Math.floor((this.y + speed * Math.sin(bestDirection)) / sizePixel)};
                    if (!checker(newCoordinate, this.pheromoneWay)){
                        possibbleDirection = bestDirection;
                    }
                }
            }
        }     

        if (possibbleDirection === null || Math.random() < 0.1 || possibbleDirection === 0) {
            let index = 0;
            do {
                index++;
                possibbleDirection = this.direction + (Math.random() - 0.5) * 0.5;
                newCoordinate = {x: Math.floor((this.x + speed * Math.cos(possibbleDirection)) / sizePixel), y: Math.floor((this.y + speed * Math.sin(possibbleDirection)) / sizePixel)};
                if (!checkWalls(newCoordinate)){
                    this.direction = possibbleDirection;
                    break;
                }

                else if (index === 200){
                    if (this.direction < 0) {
                        this.direction = Math.PI - this.direction;
                    } else {
                        this.direction = -this.direction;
                    }
                    break;
                }
            } while(true);
        }
        else {
            this.direction = possibbleDirection;
        }

       if (findDistance(Math.floor(antColony.x / sizePixel), Math.floor(antColony.y / sizePixel), currentCellX, currentCellY) < 2){
           this.isCarryingFood = false;
           this.timeWithOutFood = 1;
           this.pheromoneWay = [];
           this.direction += (Math.random() - 0.5) * 0.5;
        }
    }
    
}

function checkWalls(newCoordinate){
    if (newCoordinate.x < 0 || newCoordinate.y < 0 || newCoordinate.y >= size || newCoordinate.x >= size){
        return true;
    }
    if (map[newCoordinate.x][newCoordinate.y] === 1) {
        return true;
    }
    return false;
}

function checker(newCoordinate, path){
    if (path.length != 0){
        for (let i = 0; i < path.length; i++) { 
            if (newCoordinate.x < 0 || newCoordinate.y < 0 || newCoordinate.y >= size || newCoordinate.x >= size){
                return true;
            }
            if (path[i].x === newCoordinate.x && path[i].y === newCoordinate.y || map[newCoordinate.x][newCoordinate.y] === 1) {
                return true;
            }
        }
        return false;
    }
}

function findDistance(x1, y1, x2, y2) { //алгоритм Брезенхэма
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let directionX = x1 < x2 ? 1 : -1;
    let directionY = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    while (x1 != x2 || y1 != y2) {
        let err2 = err * 2;
        if (err2 > -dy) {
            err -= dy;
            x1 += directionX;
        }
        if (err2 < dx) {
            err += dx;
            y1 += directionY;
        }
        if (x1 < 0 || y1 < 0 || x1 > size || y1 > size){ // бывает что выходит за границы, да костыль
            return Infinity;
        }

        if (map[x1][y1] === 1) { //если стенка, то муравей не чувствует еду, возвращаем огромное расстояние
            return Infinity;
        }
    }
    return Math.sqrt(dx * dx + dy * dy);
}