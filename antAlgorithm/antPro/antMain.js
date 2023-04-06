const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const size = 80;

let map = [];
let pheromones = []; 
let antColony = {x: 0, y: 0};
let nowButton = 0;

function initializeMap(){
    for (let i = 0; i < size; i++){
        map[i] = [];
        pheromones[i] = [];
        for (let j = 0; j < size; j++) { 
            map[i][j] = 0;
            pheromones[i][j] = 0;
        }
    }
}

initializeMap();

//Короче, мир состоит из двумерного массива, поэтому будем обозначать циферками определенные объекты:
// 0 - пустота, 1 - стена, 2 - колония, 3 - еда

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

document.getElementById("clearButton").addEventListener('click', (e) => {
    ctx.reset();
    nowButton = 0;
    pheromones = [];
    map = [];
});

canvas.addEventListener('click', (e) => {
    let x = e.offsetX;
    let y = e.offsetY;

    if (nowButton === 1){
        setColony(x, y);
    }
    else if (nowButton === 2){
        setWalls(x, y);
    }
});

function setColony(x, y) {
    antColony.x = x;
    antColony.y = y;
    x = Math.floor(x/10);
	y = Math.floor(y/10);

    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){
            if (map[i][j] === 2){
                map[i][j] = 0;
                break;
            }
        }
    }
    map[x][y] = 2;
    ctx.reset();
    updateMap();
}

function setWalls(x, y){ 
    x = Math.floor(x/10);
	y = Math.floor(y/10);
    map[x][y] = 1;
    ctx.reset();
    updateMap();
}

function updateMap(){
    for (let i = 0; i < size; i++){
        for (let j = 0; j < size; j++){ 
            if (map[i][j] === 1){
                ctx.fillStyle = 'gray';
	            ctx.fillRect(i*10, j*10, 20, 20);
            }
            else if (map[i][j] === 2) {
                ctx.fillStyle = 'red';
	            ctx.fillRect(i*10, j*10, 20, 20);
            }
            else if (map[i][j] === 3) {
                ctx.fillStyle = 'green';
	            ctx.fillRect(i*10, j*10, 20, 20);
            }
        }
    }
}