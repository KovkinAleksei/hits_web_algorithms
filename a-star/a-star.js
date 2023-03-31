import { createWall, sleep, map } from "./maze.js";

// Класс для ячейки
class Node {
    parent = null;
    x = null;
    y = null;
    distanceToStart = 0;
    distanceToFinish = 0;
    sumDistances = 0;
}

// Проверка на то входит ли ячейка в поле
function isInside(x, y, size){
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

// Сама функция установки старта и финиша
let start = new Node, finish = new Node, isStartUsed;
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

// убрать ранее отрисованный путь
function clearPath() {
    let size = document.getElementById('tableSize').value;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = document.getElementById("table").rows[j].cells[i];
            cell.dataset.mode = (cell.dataset.mode == "path" || cell.dataset.mode == "checked" || cell.dataset.mode == "checking") ? "empty" : cell.dataset.mode;
        }
    }
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

// Непосредственно алгоритм поиска
export async function aStar() {

    disableButtons();

    // эвристика для алгоритма (Манхэттен)
    function heuristic(v, end) {
        return Math.abs(v.x - end.x) + Math.abs(v.y - end.y);
    }

    // сравнение двух клеток
    function compare(a, b) {
        if (a.sumDistances < b.sumDistances)
            return -1;
        if (a.sumDistances > b.sumDistances)
            return 1;
        else
            return 0;
    }

    let size = document.getElementById('tableSize').value;

    // Счетчик для скипа задержек в анимации
    let count = 0;

    // Дефолтное значение старта и финиша.
    if(start.x == null || start.y == null){
        start.x = 0;
        start.y = 0;
        table.rows[0].cells[0].dataset.mode = 'start';
    }
    if(finish.x == null || finish.y == null){
        finish.x = size - 1;
        finish.y = size - 1;
        table.rows[size - 1].cells[size - 1].dataset.mode = 'finish';
    }

    clearPath();

    let stNode = new Node();
    stNode.x = Number(start.x);
    stNode.y = Number(start.y);

     // список точек, подлежащих проверке
    let openList = new Array;
    openList.push(stNode)

     // список уже проверенных точек
    let usedList = new Array;

    let current = new Node();

    // Пока есть клетки подлежащие проверке искать путь до финиша
    while (openList.length > 0) {
        openList.sort(compare);

        // Обновляем текущую ячейку (берем с наименьшим показателем sumDistances) и усыпляем для отрисовки пути
        current = openList[0];
        openList.splice(openList.indexOf(current), 1);
        usedList.push(current);
        if (!(current.x == start.x && current.y == start.y) && !(current.x == finish.x && current.y == finish.y)) {
            document.getElementById("table").rows[current.y].cells[current.x].dataset.mode = "checked";
        }
        if(count >= Math.floor(size / 10)){
            await sleep(101 - Number(document.getElementById('animationSpeed').value));
            count = 0;
        }
        count++;

        // Нашли финиш - брейк 🤙🏻
        if (current.x == finish.x && current.y == finish.y) {
            break;
        }

        //  Прочекать соседей текущей ячейки
        let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        for (let dir = 0; dir < directions.length; dir++) {
            var newNeighbour = new Node();
            newNeighbour.x = current.x + directions[dir][0];
            newNeighbour.y = current.y + directions[dir][1];

            // Проверка соседа на нахождение в массивах
            let isUsed = usedList.find(node => (node.x === newNeighbour.x && node.y === newNeighbour.y));
            let neighbour = openList.find(node => (node.x === newNeighbour.x && node.y === newNeighbour.y));

            // Если ячейка не использована и не находится в openList просчитать дистанции
            if (isInside(newNeighbour.x, newNeighbour.y, size) && map[newNeighbour.y][newNeighbour.x] === 0 && isUsed == null) {
                if (neighbour == null) {

                    if(!(newNeighbour.x == finish.x && newNeighbour.y == finish.y))
                        table.rows[newNeighbour.y].cells[newNeighbour.x].dataset.mode = 'checking';

                    newNeighbour.distanceToStart = current.distanceToStart + 1;
                    newNeighbour.distanceToFinish = heuristic(newNeighbour, finish);
                    newNeighbour.sumDistances = newNeighbour.distanceToStart + newNeighbour.distanceToFinish;

                    newNeighbour.parent = current;
                    openList.push(newNeighbour);
                    // Если ячейка находится в openList поменять дистанцию до старта если надо
                } else {
                    if (neighbour.distanceToStart >= current.distanceToStart + 1) {
                        openList[openList.indexOf(neighbour)].distanceToStart = current.distanceToStart + 1;
                        openList[openList.indexOf(neighbour)].parent = current;
                    }
                }

            }
        }
    }

    // Не найден финиш - оповестить пользователя
    if (!(current.x == finish.x && current.y == finish.y)) {
        alert(`Не получается найти путь 😭`);
    // Найден - отрисовать путь
    } else {
        for(;current.parent != null; current = current.parent) {

            if(count >= Math.floor(size / 10)){
                await sleep(101 - Number(document.getElementById('animationSpeed').value));
                count = 0;
            }
            count++;

            if (!(current.x == finish.x && current.y == finish.y))
                document.getElementById("table").rows[current.y].cells[current.x].dataset.mode = "path"
        }
    }

    enableButtons()
}