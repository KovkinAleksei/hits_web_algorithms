const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const size = 80;

let map = [];
let pheromones = []; 
//Короче, мир состоит из двумерного массива, поэтому будем обозначать циферками определенные объекты:
// 0 - пустота, 1 - стена, 2 - колония, 3 - еда

let antColony = {x: 0, y: 0};
let nowButton = 1;

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

canvas.addEventListener('click', (e) => {
    let x = e.offsetX;
    let y = e.offsetY;

    if (nowButton === 1){
        setColony(x, y);
    }
});

function setColony(x, y) {
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
    ctx.fillStyle = 'red';
	ctx.fillRect(x*10, y*10, 20, 20);
}
