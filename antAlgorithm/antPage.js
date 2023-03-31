import {antColonyOptimization} from "./antMan.js";
// Поле для расстановки вершин графа
let canv = document.getElementById("canvas");

let vertexes = [];     // Массив вершин
let solves = [];       // Решения
const RADIUS = 10;     // Радиус вершины

// Отображение всех вершин графа
function drawVertexes() {
    let ctx = canv.getContext('2d');

    vertexes.forEach(element => {
        ctx.beginPath();
        ctx.arc(element.x, element.y, RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Сброс текущего решения
function resetSolve() {
    // Очиста поля
    let ctx = canv.getContext('2d');
    ctx.reset();

    // Обновление текущего решения
    solves = [];

    // Обображение всех вершин графа
    drawVertexes();
}

// Проведение всех рёбер в графе
function drawLines() {
    let ctx = canv.getContext('2d');

    for (let i = 0; i < vertexes.length; i++) {
        for (let j = 0; j < vertexes.length; j++) {
            ctx.moveTo(vertexes[i].x, vertexes[i].y);
            ctx.lineTo(vertexes[j].x, vertexes[j].y);
            ctx.strokeStyle = "rgb(0, 0, 0, 0.1)";
            ctx.stroke();
            ctx.beginPath();
        }
    }
}

// Нахождение расстояния между точками
function findDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

const MAXVALUE = 999999;

// Нахождение ближайшей к текущей позиции вершины
function findNearestPointIndex(x, y) {
    let minDistance = MAXVALUE;
    let index = MAXVALUE;

    for (let i = 0; i < vertexes.length; i++) {
        let distance = findDistance(vertexes[i].x, vertexes[i].y, x, y);

        if (distance < minDistance) {
            index = i;
            minDistance = distance;
        }
    }

    return index;
}

// Проверка наложения точек и их выхода за пределы поля
function drawPossibility(x, y) {
    let index = findNearestPointIndex(x, y);

    return (index == MAXVALUE || 
        findDistance(vertexes[index].x, vertexes[index].y, x, y) > 2 * RADIUS + 2 &&
        x > RADIUS && x < canv.clientWidth - RADIUS && y > RADIUS && y < canv.clientHeight - RADIUS);
}

let deleteVertexButton = document.getElementById("deleteVertexButton");
let deleteMode = false;

// Переключение режима добавления/удаления вершины
deleteVertexButton.addEventListener('click', (e) => {
    if (!deleteMode) {
        deleteMode = true;
    }
    else {
        deleteMode = false;
    }
})

// Интервал работы генетического алгоритма
let interval = null

// Удаление вершины
function deleteVertex(e) {
    // Нахождение положения курсора
    let xPos = e.offsetX;
    let yPos = e.offsetY;

    // Нахождение ближайшей к курсору вершины
    let nearestVertex = findNearestPointIndex(xPos, yPos);

    // Удаление выбранной вершины
    if (Math.abs(vertexes[nearestVertex].x - xPos) <= RADIUS && Math.abs(vertexes[nearestVertex].y - yPos) <= RADIUS) {
        vertexes.splice(nearestVertex, 1);

        // Завершение работы алгоритма
        clearInterval(interval);
        interval = null;

        // Сброс текущего решения
        resetSolve();
    }
}

// Создание новой вершины
canv.addEventListener('click', (e) => {
    if (deleteMode) {
        return;
    }

    // Завершение работы алгоритма
    clearInterval(interval);
    interval = null;

    // Нахождение положения новой вершины
    let xPos = e.offsetX;
    let yPos = e.offsetY;

    // Отображение новой вершины
    if (drawPossibility(xPos, yPos)) {
        
        // Сброс текущего решения
        resetSolve();

        // Отображение новой вершины графа
        let ctx = canv.getContext('2d');
        ctx.beginPath();
        ctx.arc(xPos, yPos, RADIUS, 0, 2 * Math.PI);
        ctx.fill();

        // Добавление в массив вершин
        vertexes.push({x: xPos, y: yPos});
    }
});

// Удаление вершин по зажатию мыши
let mouseIsDown = false;

// Удаление вершины по нажатию
canv.addEventListener('mousedown', (e) => {
    // Завершение работы алгоритма
    clearInterval(interval);
    interval = null;

    if (deleteMode) {
        deleteVertex(e);
        mouseIsDown = true;
    }
});

// Удаление вершины при движении мыши
canv.addEventListener('mousemove', (e) => {
    if (mouseIsDown && deleteMode) {
        deleteVertex(e);
    }
});

// Остановка удаления вершин при разжатии мыши
canv.addEventListener('mouseup', (e) => {
    mouseIsDown = false;
});

// Отображение найденного решения
function showSolve(solves) {
    // Обновление поля
    let ctx = canv.getContext('2d');
    console.log(solves);
    let solve = solves.path;
    // Проведение ребёр в найденном маршруте
    for (let i = 0; i < solve.length - 1; i++) {
        ctx.moveTo(vertexes[solve[i]].x, vertexes[solve[i]].y);
        ctx.lineTo(vertexes[solve[i + 1]].x, vertexes[solve[i + 1]].y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = "4";
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.beginPath();
    }

    // Соединение начальной и конечной вершин в маршруте
    ctx.moveTo(vertexes[solve[solve.length - 1]].x, vertexes[solve[solve.length - 1]].y);
    ctx.lineTo(vertexes[solve[0]].x, vertexes[solve[0]].y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = "4";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();

    // Обображение всех вершин графа
    drawVertexes();
}

let findPathButton = document.getElementById("findPathButton");
let timeout = 10;

// Запуск генетического алгоритма
findPathButton.addEventListener('click', (e) => {
    // Сброс работы алгоритма
    clearInterval(interval);
    interval = null;
    //console.log(antColonyOptimization(vertexes));
    // Запуск работы алгоритма
    //interval = setInterval(function() {
        // Обновление поля
        let ctx = canv.getContext('2d');
        ctx.reset();

        // Обображение всех вершин графа
        drawVertexes();

        // Проведение всех рёбер в графе 
        drawLines();

        // Вывод текущего решения
       showSolve(antColonyOptimization(vertexes));

    //}, timeout);
});

let clearButton = document.getElementById("clearButton");

// Очистка поля
clearButton.addEventListener('click', (e) => {
    // Удаление вешин с поля
    let ctx = canv.getContext('2d');
    ctx.reset();

    // Удаление вершин из массива
    vertexes = [];
    solves = [];

    // Завершение работы алгоритма
    clearInterval(interval);
    interval = null;
})

let inputRange = document.getElementById("inputRange");

// Изменение задержки работы алгоритма
inputRange.addEventListener('change', (e) => {
    let counter = document.getElementById("counter");
    counter.innerHTML = inputRange.value;
    timeout = inputRange.value;

    // Изменение скорости выполнения текущего запущенного алгоритма
    if (interval) {
        clearInterval(interval);
        interval = null;

        findPathButton.click();
    }
});