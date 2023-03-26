import {getSolves} from './geneticAlgorithm.js';

// Поле для расстановки вершин графа
let canv = document.getElementById("canvas");

let vertexes = [];     // Массив вершин
let solves = [];       // Решения
const RADIUS = 10;     // Радиус вершины

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

// Интервал работы генетического алгоритма
let interval = null

// Создание новой вершины
canv.addEventListener('click', (e) => {
    // Нахождение положения новой вершины
    let xPos = e.clientX - canv.getBoundingClientRect().left;
    let yPos = e.clientY - canv.getBoundingClientRect().top;
    
    // Отображение новой вершины
    if (drawPossibility(xPos, yPos) && !interval) {
        let ctx = canv.getContext('2d');
        ctx.beginPath();
        ctx.arc(xPos, yPos, RADIUS, 0, 2 * Math.PI);
        ctx.fill();

        // Добавление в массив вершин
        vertexes.push({x: xPos, y: yPos});
    }
})

// Отображение найденного решения
function showSolve(solve) {
    // Обновление поля
    let ctx = canv.getContext('2d');
    ctx.reset();

    // Обображение всех вершин графа
    vertexes.forEach(element => {
        ctx.beginPath();
        ctx.arc(element.x, element.y, RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Проведение ребёр в найденном маршруте
    for (let i = 0; i < solve.length - 1; i++) {
        ctx.moveTo(vertexes[solve[i]].x, vertexes[solve[i]].y);
        ctx.lineTo(vertexes[solve[i + 1]].x, vertexes[solve[i + 1]].y);
        ctx.stroke();
        ctx.beginPath();
    }

    ctx.moveTo(vertexes[solve[0]].x, vertexes[solve[0]].y);
    ctx.lineTo(vertexes[solve[solve.length - 1]].x, vertexes[solve[solve.length - 1]].y);
    ctx.stroke();
    ctx.beginPath();
}

let findStartButton = document.getElementById("findPathButton");

// Запуск генетического алгоритма
findStartButton.addEventListener('click', (e) => {
    interval = setInterval(function() {
        // Обновление поля
        let ctx = canv.getContext('2d');
        ctx.reset();

        // Обображение всех вершин графа
        vertexes.forEach(element => {
            ctx.beginPath();
            ctx.arc(element.x, element.y, RADIUS, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Проведение всех рёбер в графе
        for (let i = 0; i < vertexes.length; i++) {
            for (let j = 0; j < vertexes.length; j++) {
                ctx.moveTo(vertexes[i].x, vertexes[i].y);
                ctx.lineTo(vertexes[j].x, vertexes[j].y);
                ctx.stroke();
                ctx.beginPath();
            }
        }

        // Выход из интервала
        if (vertexes.length == 0) {
            clearInterval(interval);
            interval = null;
        }

        // Генерация популяции
        let currentSolve = getSolves(vertexes, solves);
        showSolve(currentSolve);
    }, 100);
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
