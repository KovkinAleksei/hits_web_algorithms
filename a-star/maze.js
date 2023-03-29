class Coords {
    x = null;
    y = null;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

export let map = new Array();

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
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


// Создание таблицы
function createTable(){

    // удалить таблицу
    var table = document.getElementById('table');
    if (table !== null)
        table.remove();

    // создать новую таблицу
    table = document.createElement("table"); 
    table.id = 'table';
    table.border = 1;

    var row, cell;
    var size = document.getElementById('tableSize').value;
    let maxSize = document.getElementById('tableSize').max;
    if (size < 5) 
        size = 5;

    if(size % 2 !== 1)
        size++;

    size = Math.min(maxSize, size);
    document.getElementById("tableSize").value = size;

    map.length = 0;

    for (var column = 0; column < size; column++) { 
        r = table.insertRow(column);
        map[column] = new Array();

        for (var row = 0; row < size; row++) {
            cell = r.insertCell(row);

            cell.dataset.mode = "empty"; // тип клетки
            cell.dataset.x = column;
            cell.dataset.y = row;

            map[column][row] = 0;
        }
    }

    document.getElementById("tableBlock").appendChild(table);
}

// Создание лабиринта
async function createPrimmLabyrinth() {

    let primmButton = document.getElementById('primmButton');
    primmButton.textContent= "ГЕНЕРАЦИЯ ЛАБИРИНТА...";
    primmButton.disabled = true;

    let size = document.getElementById('tableSize').value;
    console.log("size = " + size);

    var delay = Math.pow((100 - size), 0.3);
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
    let startAngle = Math.floor(Math.random() * 4) + 1;
    let cell;
    switch (startAngle) {
        case 1:
            cell = new Coords(0, 0);
            break;
        case 2:
            cell = new Coords(size - 1, 0);
            break;
        case 3:
            cell = new Coords(size - 1, size - 1);
            break;
        case 4:
            cell = new Coords(0, size - 1);
            break;
    }

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
    let to_check = new Array;
    if (cell.y - 2 >= 0) {
        to_check.push(new Coords(cell.x, cell.y - 2));
        isUsed[cell.x][cell.y - 2] = true;
    }
    if (cell.y + 2 < size) {
        to_check.push(new Coords(cell.x, cell.y + 2));
        isUsed[cell.x][cell.y + 2] = true;
    }
    if (cell.x - 2 >= 0) {
        to_check.push(new Coords(cell.x - 2, cell.y));
        isUsed[cell.x - 2][cell.y] = true;
    }
    if (cell.x + 2 < size) {
        to_check.push(new Coords(cell.x + 2, cell.y));
        isUsed[cell.x + 2][cell.y] = true;
    }

    let count = 0;
    let skipDelay = (size < 60) ? true : false;
    // Пока есть элементы в массиве, выбрать рандомный и убрать стены.
    while (to_check.length > 0) {
        let index = Math.floor(Math.random() * to_check.length);
        let x = to_check[index].x;
        let y = to_check[index].y;
        makeEmpty(x, y);
        to_check.splice(index, 1);
        

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
            to_check.push(new Coords(x, y - 2));
            isUsed[x][y - 2] = true;
        }
        if (y + 2 < size && !isEmpty(x, y + 2) && !isUsed[x][y + 2]) {
            to_check.push(new Coords(x, y + 2));
            isUsed[x][y + 2] = true;
        }
        if (x - 2 >= 0 && !isEmpty(x - 2, y) && !isUsed[x - 2][y]) {
            to_check.push(new Coords(x - 2, y));
            isUsed[x - 2][y] = true;
        }
        if (x + 2 < size && !isEmpty(x + 2, y) && !isUsed[x + 2][y]) {
            to_check.push(new Coords(x + 2, y));
            isUsed[x + 2][y] = true;
        }

        if(skipDelay || count == Math.floor(size / 10)){
            await sleep(delay);
            count = 0;
        }
        count++;
    }

    primmButton.disabled = false;
    primmButton.textContent= "Сгенерировать лабиринт";
}

createTable();