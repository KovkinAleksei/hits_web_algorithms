import { Ant } from "./antClass.js";

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const size = 80;

export let speed = 1;
export let map = [];
export let pheromoneMap = []; 

let antColony = {x: 0, y: 0};
let nowButton = 0;
let ants = [];
let antCount = 1;
let requestId;

function initializeMap(){
    for (let i = 0; i <= size; i++){
        map[i] = [];
        pheromoneMap[i] = [];
        for (let j = 0; j <= size; j++) { 
            map[i][j] = 0;
            pheromoneMap[i][j] = 0;
        }
    }
}
initializeMap();

//Короче, мир состоит из двумерного массива, поэтому будем обозначать циферками определенные объекты:
// 0 - пустота, 1 - стена, 2 - колония, 3 - еда, 4 - невидимая стена (вынужденная мера)

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
}

function setColony(x, y) {
    antColony.x = x;
    antColony.y = y;
    x = Math.floor(x/10);
	y = Math.floor(y/10);

    for (let i = 0; i <= size; i++){
        for (let j = 0; j <= size; j++){
            if (map[i][j] === 2){
                map[i][j] = 0;
                break;
            }
        }
    }
    map[x][y] = 2;
    ants = [];
    for (let i = 0; i < antCount; i++){
        ants.push(new Ant(antColony.x, antColony.y));
    }
    updateMap();
}

function setWalls(x, y){ 
    x = Math.floor(x/10);
	y = Math.floor(y/10);
    if (map[x][y] !== 2){
        map[x][y] = 1;
        updateMap();
    }
}

function updateAnts() {
    if (ants.length != 0){
        updateMap();
        ants.forEach((ant) => {
            ant.updatePosition();
            ant.draw();
            ant.drawPheromones();
        });
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

/*---------------------------------------Просто отработчики нажатий-------------------------------------------*/

document.getElementById("startButton").addEventListener('click', (e) => {
    updateAnts();
    document.getElementById("startButton").disabled = true;
});
 
document.getElementById("clearButton").addEventListener('click', (e) => {
    cancelAnimationFrame(requestId);
    ctx.reset();
    nowButton = 0;
    ants = [];
    initializeMap();
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

document.getElementById("eraseButton").addEventListener('click', (e) => {
    if (nowButton !== 3){
        nowButton = 3;
    }
    else if (nowButton === 3){
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