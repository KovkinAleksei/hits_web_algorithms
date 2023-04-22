import { map } from "./table.js";
import { sleep, setDefaultStartFinish, enableButtons, disableButtons } from "./a-star_functions.js";

class Coords {
    x = null;
    y = null;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

// Сделать поле пустым
function makeEmpty(x, y) {
    map[x][y] = 0;
    document.getElementById('table').rows[x].cells[y].dataset.mode = "empty";
}
// Сделать поле стеной
function makeWall(x, y) {
    map[x][y] = 1;
    document.getElementById('table').rows[x].cells[y].dataset.mode = "wall";
}
// Проверка на tmpty поле
function isEmpty(x, y){
    return map[x][y] === 0 ? true : false;
}

// Создание лабиринта
export async function createPrimmLabyrinth() {
    disableButtons();

    primmButton.textContent= "ГЕНЕРАЦИЯ ЛАБИРИНТА...";

    let size = document.getElementById('tableSize').value;

    var delay = Math.pow((100 - size), 0.8);
    // Создание массива лабиринта
    let map = new Array(size);
    for(let i = 0; i < size; i++) {
        map[i] = new Array(size);
    }


    //Заполнение лабиринта стенами
//   for (let i = 0; i < size; i++) {
//       for (let j = 0; j < size; j++) {
//           makeWall(i, j);
//       }
//       await sleep(1);
//   }

    // Красивое заполнение лабиринта стенами
    let topRow = 0;
    let bottomRow = size - 1;
    let leftCol = 0;
    let rightCol = size - 1;
    
    while (topRow <= bottomRow && leftCol <= rightCol) {
        for (let i = leftCol; i <= rightCol; i++) {
        makeWall(topRow, i);
        }
        topRow++;

        for (let i = topRow; i <= bottomRow; i++) {
        makeWall(i, rightCol);
        }
        rightCol--;

        if (topRow <= bottomRow) {
        for (let i = rightCol; i >= leftCol; i--) {
            makeWall(bottomRow, i);
        }
        bottomRow--;
        }

        if (leftCol <= rightCol) {
        for (let i = bottomRow; i >= topRow; i--) {
            makeWall(i, leftCol);
        }
        leftCol++;
        }
        await sleep(10);
    }

    // Рандомно выбирается угол откуда начнет генерироваться лабиринт.
    // let startAngle = Math.floor(Math.random() * 4) + 1;
    // let cell;
    // switch (startAngle) {
    //     case 1:
    //         cell = new Coords(0, 0);
    //         break;
    //     case 2:
    //         cell = new Coords(size - 1, 0);
    //         break;
    //     case 3:
    //         cell = new Coords(size - 1, size - 1);
    //         break;
    //     case 4:
    //         cell = new Coords(0, size - 1);
    //         break;
    // }

    // Рандомная ячейка начала генерации лабиринта
    let cell = new Coords(Math.floor((Math.random() * (size / 2))) * 2, Math.floor((Math.random() * (size / 2))) * 2); 
    makeEmpty(cell.x, cell.y);

    // массив использованных ячеек
    let isUsed = new Array(size);
    for(let i = 0; i < size; i++){
        isUsed[i] = new Array(size);
        for(let j = 0; j < size; j++) {
            isUsed[i][j] = false;
        }
    }
    isUsed[cell.x][cell.y] = true;

    // Создание массива и добавление туда точек лабиринта находящиеся в двух клетках от координаты которую выбрали выше.
    let toCheck = new Array;
    if (cell.y - 2 >= 0) {
        toCheck.push(new Coords(cell.x, cell.y - 2));
        isUsed[cell.x][cell.y - 2] = true;
    }
    if (cell.y + 2 < size) {
        toCheck.push(new Coords(cell.x, cell.y + 2));
        isUsed[cell.x][cell.y + 2] = true;
    }
    if (cell.x - 2 >= 0) {
        toCheck.push(new Coords(cell.x - 2, cell.y));
        isUsed[cell.x - 2][cell.y] = true;
    }
    if (cell.x + 2 < size) {
        toCheck.push(new Coords(cell.x + 2, cell.y));
        isUsed[cell.x + 2][cell.y] = true;
    }

    // Счетчик для скипа задержек в анимации
    let count = 0;
    
    // Пока есть элементы в массиве, выбрать рандомный и убрать стены.
    while (toCheck.length > 0) {
        let index = Math.floor(Math.random() * toCheck.length);
        let x = toCheck[index].x;
        let y = toCheck[index].y;
        makeEmpty(x, y);
        toCheck.splice(index, 1);
        

        // Убарть стену в ячейке находящейся между рандомной ячейкой и ее родителем.
        let directions = ["NORTH", "SOUTH", "EAST", "WEST"];
        let flag = false;
        while (directions.length > 0 && !flag) {
            let dir_index = Math.floor(Math.random() * directions.length);
            switch (directions[dir_index]) {
            case "NORTH":
                if ( y - 2 >= 0 && isEmpty(x, y - 2)) {
                    makeEmpty(x, y - 1);
                    flag = true;
                }
                break;
            case "SOUTH":
                if (y + 2 < size && isEmpty(x, y + 2)) {
                    makeEmpty(x, y + 1);
                    flag = true;
                }
                break;
            case "EAST":
                if (x - 2 >= 0 && isEmpty(x - 2, y)) {
                    makeEmpty(x - 1, y);
                    flag = true;
                }
                break;
            case "WEST":
                if (x + 2 < size && isEmpty(x + 2, y)) {
                    makeEmpty(x + 1, y);
                    flag = true;
                }
                break;
            }
            directions.splice(dir_index, 1);
        }




        // Добавить новые клетки которые можно зачистить.
        if (y - 2 >= 0 && !isEmpty(x, y - 2) && !isUsed[x][y - 2]) {
            toCheck.push(new Coords(x, y - 2));
            isUsed[x][y - 2] = true;
        }
        if (y + 2 < size && !isEmpty(x, y + 2) && !isUsed[x][y + 2]) {
            toCheck.push(new Coords(x, y + 2));
            isUsed[x][y + 2] = true;
        }
        if (x - 2 >= 0 && !isEmpty(x - 2, y) && !isUsed[x - 2][y]) {
            toCheck.push(new Coords(x - 2, y));
            isUsed[x - 2][y] = true;
        }
        if (x + 2 < size && !isEmpty(x + 2, y) && !isUsed[x + 2][y]) {
            toCheck.push(new Coords(x + 2, y));
            isUsed[x + 2][y] = true;
        }

        if(count >= Math.floor(size / 10)){
            await sleep(delay);
            count = 0;
        }
        count++;
    }

    // Поставить дефолтное значение для старта и финиша.
    table.rows[0].cells[0].dataset.mode = 'start';
    table.rows[size - 1].cells[size - 1].dataset.mode = 'finish';
    setDefaultStartFinish();


    enableButtons();
    primmButton.textContent= "Сгенерировать лабиринт";
}
