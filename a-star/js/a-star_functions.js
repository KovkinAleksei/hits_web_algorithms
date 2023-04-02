import { map } from "./table.js"

// Класс для ячейки
export class Node {
    parent = null;
    x = null;
    y = null;
    distanceToStart = 0;
    distanceToFinish = 0;
    sumDistances = 0;
}


export let start = new Node;
export let finish = new Node;
export let isStartUsed = false;

// Проверка на то входит ли ячейка в поле
export function isInside(x, y, size){
    return (x >= 0 && x < size && y >= 0 && y < size) ? true : false;
}

// Функция очистить ячейки старта и финиша
function clearStartFinish() {
    let size = document.getElementById('tableSize').value;
    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            let cell = document.getElementById('table').rows[i].cells[j];

            if(cell.dataset.mode == "start" || cell.dataset.mode == "finish") {
                cell.dataset.mode = "empty";
            }
        }
    }
}

// убрать ранее отрисованный путь
export function clearPath() {
    let size = document.getElementById('tableSize').value;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = document.getElementById("table").rows[j].cells[i];
            cell.dataset.mode = (cell.dataset.mode == "path" || cell.dataset.mode == "checked" || cell.dataset.mode == "checking") ? "empty" : cell.dataset.mode;
        }
    }
}

// Функция подготовка к установке старта и финиша пользователем
export function setStartFinish() {

    clearPath();
    disableButtons();
    var table = document.getElementById("table");
    table.removeEventListener("click", createWall);

    clearStartFinish();
    isStartUsed = false;
    table.addEventListener("click", setTargets);
}

// Установить старт в начало таблицы, финиш в конец таблицы
export function setDefaultStartFinish() {
    let size = document.getElementById('tableSize').value;
    start.x = 0;
    start.y = 0;
    finish.x = size - 1;
    finish.y = size - 1;
    document.getElementById('table').rows[start.y].cells[start.x].dataset.mode = 'start';
    document.getElementById('table').rows[finish.y].cells[finish.x].dataset.mode = 'finish';
}

// Функция блокировки кнопок
export function disableButtons() {
    let primmButton = document.getElementById('primmButton');
    primmButton.disabled = true;

    let aStarButton = document.getElementById('aStar');
    aStarButton.disabled = true;
    
    let changeSize = document.getElementById('tableSize');
    changeSize.disabled = true;

    let setButton = document.getElementById('setStartFinish');
    setButton.disabled = true;
}

// Функция разблокировки кнопок
export function enableButtons() {
    let primmButton = document.getElementById('primmButton');
    primmButton.disabled = false;

    let aStarButton = document.getElementById('aStar');
    aStarButton.disabled = false;
    
    let changeSize = document.getElementById('tableSize');
    changeSize.disabled = false;

    let setButton = document.getElementById('setStartFinish');
    setButton.disabled = false;
}

// создать стену на нажатой ячейке
export function createWall() {
    let cell = event.target;
    let x = cell.dataset.x, y = cell.dataset.y;
    if(cell.dataset.mode != "start" && cell.dataset.mode != "finish") {
        cell.dataset.mode = (cell.dataset.mode === "wall") ? "empty" : "wall";
        map[x][y] = (map[x][y] === 1) ? 0 : 1;
    }
}

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// Функция установки старта и финиша
function setTargets() {
    let cell = event.target;
    if(!isStartUsed && cell.dataset.mode == "empty") {
        cell.dataset.mode = 'start';
        start.x = cell.dataset.y;
        start.y = cell.dataset.x;
        isStartUsed = true;
    } else if (isStartUsed && cell.dataset.mode == "empty") {
        cell.dataset.mode = 'finish';
        finish.x = cell.dataset.y;
        finish.y = cell.dataset.x;
        table.removeEventListener("click", setTargets);
        table.addEventListener("click", createWall);
        
        enableButtons()
    }
}