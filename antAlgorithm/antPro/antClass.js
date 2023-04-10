import { canvas, ctx, map, pheromoneMap, speed, size, foodPositions, sizePixel, antColony } from "./antMain.js";

const pheromoneStrength = 1;

const foodSearchRadius = 10;

export class Ant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = Math.random() * 2 * Math.PI;
        this.pheromones = [];
        this.isCarryingFood = false;
    }

    updatePosition() {
        if (this.isCarryingFood) {
            this.followHome();
        } else {
            this.followFood(foodPositions);
        }

        this.x += speed * Math.cos(this.direction);
        this.y += speed * Math.sin(this.direction);

        if (this.x > 0 && this.x < canvas.width && this.y > 0 && this.y < canvas.height){
            this.pheromones.push({ x: this.x, y: this.y, time: 25 });
            pheromoneMap[Math.floor(this.x / 10)][Math.floor(this.y / 10)] = pheromoneStrength;
        }

        if (this.x < 0 || this.x > canvas.width) {
            this.direction = Math.PI - this.direction;
        }

        if (this.y < 0 || this.y > canvas.height) {
            this.direction = - this.direction;
        }

        // 1 - это стена
        if (this.x > 0 && this.x < canvas.width && this.y > 0 && this.y < canvas.height) {
            if (map[Math.floor(this.x / 10)][Math.floor(this.y / 10)] === 1){
                if (this.direction < 0) {
                    this.direction = Math.PI - this.direction;
                }
                else {
                    this.direction = -this.direction;
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
            ctx.fillStyle = "rgba(255, 0, 0, " + (this.pheromones[i].time / 25) + ")";
            ctx.beginPath();
            ctx.arc(this.pheromones[i].x, this.pheromones[i].y, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    findFood(foodPositions) {
        let closestFood = null;
        let closestDistance = Infinity;
        for (let i = 0; i < foodPositions.length; i++) {
            let nowX =  Math.floor(this.x / 10);
            let nowY =  Math.floor(this.y / 10);
            let distance = findDistance(foodPositions[i].x, foodPositions[i].y, nowX, nowY);
            if (distance < closestDistance && distance <= foodSearchRadius) {
                closestDistance = distance;
                closestFood = foodPositions[i];
            }
        }
        return closestFood;
    }

    followFood(foodPositions) {
        let food = this.findFood(foodPositions);
        if (food && !this.isCarryingFood) {
            let dx = food.x - Math.floor(this.x / 10);
            let dy = food.y - Math.floor(this.y / 10);
            this.direction = Math.atan2(dy, dx);
            if (dx < 1 && dy < 1){
                this.isCarryingFood = true;
            }
        } else {
            this.direction += (Math.random() - 0.5) * 0.5;
        }
    }

    followHome() {
        // Найти координаты муравейника
        let colonyX = Math.floor(antColony.x / 10);
        let colonyY = Math.floor(antColony.y / 10);
    
        // Определить ячейку в массиве pheromoneMap, соответствующую текущему положению муравья
        let currentCellX = Math.floor(this.x / 10);
        let currentCellY = Math.floor(this.y / 10);
    
        // Определить область вокруг муравья, где будут искаться феромоны
        let searchRadius = 2;
        let startX = Math.max(0, currentCellX - searchRadius);
        let endX = Math.min(pheromoneMap.length - 1, currentCellX + searchRadius);
        let startY = Math.max(0, currentCellY - searchRadius);
        let endY = Math.min(pheromoneMap[0].length - 1, currentCellY + searchRadius);
    
        // Найти направление, ведущее к муравейнику, с учетом феромонов
        let maxPheromone = 0;
        let bestDirection = null;
        let pheromoneProbability = 0.7;

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                if (x === colonyX && y === colonyY) {
                    continue;
                }
                let pheromoneLevel = pheromoneMap[x][y];
                if (pheromoneLevel > 0) {
                    // Вычислить расстояние до клетки с феромонами
                    let distance = Math.sqrt((x - currentCellX) ** 2 + (y - currentCellY) ** 2);
                    // Вычислить вероятность перехода на клетку с феромонами
                    let probability = pheromoneLevel / distance;
                    // Обновить значение вероятности
                    pheromoneProbability = Math.max(pheromoneProbability, probability);
                }
            }
        }

        // Сделать случайный выбор с учетом вероятности перехода на клетку с феромонами
        if (Math.random() < pheromoneProbability * 2) {
            // Найти клетку с максимальным уровнем феромонов
            maxPheromone = 0;
            bestDirection = null;
            for (let x = startX; x <= endX; x++) {
                for (let y = startY; y <= endY; y++) {
                    if (x === colonyX && y === colonyY) {
                        continue;
                    }
                    let pheromoneLevel = pheromoneMap[x][y];
                    if (pheromoneLevel > maxPheromone) {
                        maxPheromone = pheromoneLevel;
                        let dx = x - currentCellX;
                        let dy = y - currentCellY;
                        bestDirection = Math.atan2(dy, dx);
                    }
                }
            }
            // Изменить направление муравья на направление к клетке с максимальным уровнем феромонов
            this.direction = bestDirection;
        }
    
        // Если феромонов рядом нет, то выбрать направление наугад
        if (bestDirection === null) {
            this.direction += (Math.random() - 0.5) * 0.5;
        } else {
            this.direction = bestDirection;
        }
    
        // Если муравей достиг муравейника, он сбрасывает феромоны
        if (currentCellX === colonyX && currentCellY === colonyY) {
            this.isCarryingFood = false;
            this.pheromones = [];
        }
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
        if (x1 < 0 || y1 < 0){ // бывает что выходит за границы, да костыль
            return Infinity;
        }

        if (map[x1][y1] === 1) { //если стенка, то муравей не чувствует еду, возвращаем огромное расстояние
            return Infinity;
        }
    }
    return Math.sqrt(dx * dx + dy * dy);
}

