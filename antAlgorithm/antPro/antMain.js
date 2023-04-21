import { Ant } from "./antClass.js";

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const size = 80;
export const sizePixel = 10;

export let speed = 5;
export let map = [];
export let pheromoneMap = []; 
export let pheromoneWithFoodMap = []; 
export let foodPositions = [];
export let antColony = {x: 0, y: 0};

let nowButton = 0;
let ants = [];
let antCount = 200;
let requestId;
let isColonySet = false;

function initializeMap(){
    for (let i = 0; i <= size; i++){
        map[i] = [];
        pheromoneMap[i] = [];
        pheromoneWithFoodMap[i] = [];
        for (let j = 0; j <= size; j++) {
            map[i][j] = 0;
            pheromoneMap[i][j] = 0;
            pheromoneWithFoodMap[i][j] = 0;
            if (i === size || j === size) {
                map[i][j] = 1;
            }
        }
    }
}
initializeMap();

//Короче, мир состоит из двумерного массива, поэтому будем обозначать циферками определенные объекты:
// 0 - пустота, 1 - стена, 2 - колония, 3 - еда

canvas.addEventListener('click', (e) => {
    handler(e);
});

function handler(e){
    let x = e.offsetX;
    let y = e.offsetY;

    if (nowButton === 1){
        setColony(x, y);
    }
    else if (nowButton === 2){
        setWalls(x, y);
    }
    else if (nowButton === 3){
        setFood(x, y);
    }
    else if (nowButton === 4){
        erase(x, y);
    }
}


function erase(x, y){
    x = Math.floor(x/sizePixel);
	y = Math.floor(y/sizePixel);

    if (map[x][y] !== 0 || map[x][y] !== 2) {
        map[x][y] = 0;
        updateMap();
    }
}

function setColony(x, y) {
    antColony.x = x;
    antColony.y = y;
    x = Math.floor(x / sizePixel);
	y = Math.floor(y / sizePixel);

    for (let i = 0; i <= size; i++){
        for (let j = 0; j <= size; j++){
            if (map[i][j] === 2){
                map[i][j] = 0;
                break;
            }
            pheromoneMap[i][j] = 0;
            pheromoneWithFoodMap[i][j] = 0;
        }
    }
    map[x][y] = 2;
    pheromoneMap[x][y] = 200;
    ants = [];
    for (let i = 0; i < antCount; i++){
        ants.push(new Ant(antColony.x, antColony.y, antColony));
    }
    isColonySet = true;
    updateMap();
}

function setFood(x, y) { 
    x = Math.floor(x / sizePixel);
	y = Math.floor(y / sizePixel);
    if (map[x][y] === 0) {
        map[x][y] = 3;
        pheromoneWithFoodMap[x][y] = 10;
        foodPositions.push({x: x, y: y});
        updateMap();
    }
}

function setWalls(x, y){ 
    x = Math.floor(x / sizePixel);
	y = Math.floor(y / sizePixel);

    let startX = Math.max(0, x - 1);
    let endX = Math.min(size - 1, x + 1);
    let startY = Math.max(0, y - 1);
    let endY = Math.min(size - 1, y + 1);

    for (let i = startX; i <= endX; i++){
        for (let j = startY; j <= endY; j++){
            if (map[i][j] !== 2){
                map[i][j] = 1;
                pheromoneMap[i][j] = 0;
                pheromoneWithFoodMap[i][j] = 0;
            }
        }
    }
    updateMap();
}

function updateAnts() {
    if (ants.length != 0){
        updateMap();
        ants.forEach((ant) => {
            ant.updatePosition();
            ant.draw();
            ant.drawPheromones();
        });
        updatePheromones();
        requestId = requestAnimationFrame(updateAnts);
    }
}

function updateMap(){
    ctx.reset();
    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){ 
            if (map[i][j] === 1){
                ctx.fillStyle = 'gray';
	            ctx.fillRect(i*10, j*10, 10, 10);
            }
            else if (map[i][j] === 2) {
                ctx.fillStyle = 'red';
	            ctx.beginPath();
                ctx.arc(i*10, j*10, 15, 0, 2 * Math.PI);
                ctx.fill();
            }
            else if (map[i][j] === 3) {
                ctx.fillStyle = 'green';
	            ctx.fillRect(i*10, j*10, 20, 20);
            }
        }
    }
}

function updatePheromones(){
    let x = Math.floor(antColony.x / sizePixel);
	let y = Math.floor(antColony.y / sizePixel);
    for (let i = 0; i < size; i++){ 
        for (let j = 0; j < size; j++){
            if (i === x && j === y){
                pheromoneMap[i][j] = 200;
                continue;
            }

            if (map[i][j] === 1) {
                pheromoneMap[i][j] = 0;
                pheromoneWithFoodMap[i][j] = 0;
            }

            if (pheromoneMap[i][j] === Infinity || pheromoneWithFoodMap[i][j] === Infinity) {
                pheromoneMap[i][j] = 0;
                pheromoneWithFoodMap[i][j] = 0;
            }

            pheromoneMap[i][j] = pheromoneMap[i][j] * 0.998;
            ctx.fillStyle = "rgba(255, 0, 0, " + pheromoneMap[i][j] * 10  + ")";
            ctx.beginPath();
            ctx.arc(i * 10, j * 10, 0.8, 0, 2 * Math.PI);
            ctx.fill();
            

            pheromoneWithFoodMap[i][j] = pheromoneWithFoodMap[i][j] * 0.998;
            ctx.fillStyle = "rgba(0, 100, 0, " + pheromoneWithFoodMap[i][j] * 10  + ")";
            ctx.beginPath();
            ctx.arc(i * 10, j * 10, 1, 0, 2 * Math.PI);
            ctx.fill();

            if (pheromoneMap[i][j] < 0.01){
                pheromoneMap[i][j] = 0;
            }
            if (pheromoneWithFoodMap[i][j] < 0.01){
                pheromoneWithFoodMap[i][j] = 0;
            }
        }
    }
}
/*---------------------------------------Просто отработчики нажатий-------------------------------------------*/

document.getElementById("startButton").addEventListener('click', (e) => {
    if (isColonySet){
        updateAnts();
        document.getElementById("startButton").disabled = true;
    } else {
        nowButton = 0;
        alert("Сначала установите колонию муравьев!");
    } 
});
document.getElementById("stopButton").addEventListener('click', (e) => {
    cancelAnimationFrame(requestId);
    ants = [];
    isColonySet = false;
    document.getElementById("startButton").disabled = false;
    for (let i = 0; i <= size; i++){
        for (let j = 0; j <= size; j++){
            pheromoneMap[i][j] = 0;
            pheromoneWithFoodMap[i][j] = 0;
        }
    }
    map[Math.floor(antColony.x / sizePixel)][Math.floor(antColony.y / sizePixel)] = 0;
    updateMap();
});
 
document.getElementById("clearButton").addEventListener('click', (e) => {
    cancelAnimationFrame(requestId);
    ctx.reset();
    nowButton = 0;
    ants = [];
    foodPositions = [];
    initializeMap();
    isColonySet = false;
    document.getElementById("startButton").disabled = false;
}); 

document.getElementById("antRange").addEventListener('input', (e) => {
    document.getElementById("antCount").innerHTML = antRange.value;
    antCount = antRange.value;
});

document.getElementById("speedRange").addEventListener('input', (e) => {
    document.getElementById("speedCount").innerHTML = speedRange.value;
    speed = speedRange.value;
});

document.getElementById("addAnthillButton").addEventListener('click', (e) => {
    if (nowButton !== 1){
        nowButton = 1;
    }
    else if (nowButton === 1){
        nowButton = 0;
    }
});

document.getElementById("addWallsButton").addEventListener('click', (e) => {
    if (nowButton !== 2){
        nowButton = 2;
    }
    else if (nowButton === 2){
        nowButton = 0;
    }
});

document.getElementById("addFoodButton").addEventListener('click', (e) => {
    if (nowButton !== 3){
        nowButton = 3;
    }
    else if (nowButton === 3){
        nowButton = 0;
    }
});

document.getElementById("eraseButton").addEventListener('click', (e) => {
    if (nowButton !== 4){
        nowButton = 4;
    }
    else if (nowButton === 4){
        nowButton = 0;
    }
});

document.getElementById('canvas').addEventListener('mousedown', startDrawing);
document.getElementById('canvas').addEventListener('mouseup', stopDrawing);
document.getElementById('canvas').addEventListener('mouseleave', stopDrawing);

function startDrawing() {
    document.getElementById('canvas').addEventListener('mousemove', handler);
}

function stopDrawing() {
    document.getElementById('canvas').removeEventListener('mousemove', handler);
}