import { solves, showSolve, drawVertexes, vertexes, resetSolve } from "./geneticPage.js";

export let drawFullGraph = false;   // Отображение/скрытие полного графа
export let POPULATION = 1500;       // Кол-во решений в популяции
export let CHILDS = 1500;           // Кол-во детей при скрещивании
export let MUTPROB = 70;            // Вероятность мутации при скрещивании

let canv = document.getElementById("canvas");

const fullGraphCheckbox = document.getElementById("fullGraph");

// Проведение всех рёбер в графе
export function drawLines() {
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

// Отрисовка / удаление полного графа
fullGraphCheckbox.addEventListener('click', (e) => {
    drawFullGraph = fullGraphCheckbox.checked;
    
    let ctx = canv.getContext('2d');
    ctx.reset();

    if (drawFullGraph){
        drawLines();
    }

    drawVertexes();
    showSolve(solves[0]);
});

let populationRange = document.getElementById("populationRange");

// Изменение кол-ва решений в популяции
populationRange.addEventListener('change', (e) => {
    let counter = document.getElementById("populationCounter");
    counter.innerHTML = populationRange.value;
    POPULATION = Number(populationRange.value);
    resetSolve();
});

let childsRange = document.getElementById("childsRange");

// Изменение кол-ва детей при скрещивании
childsRange.addEventListener('change', (e) => {
    let counter = document.getElementById("childsCounter");
    counter.innerHTML = childsRange.value;
    CHILDS = Number(childsRange.value);
    resetSolve();
});

let mutationRange = document.getElementById("mutationRange");

// Изменение вероятности мутации при скрещивании
mutationRange.addEventListener('change', (e) => {
    let counter = document.getElementById("mutationCounter");
    counter.innerHTML = mutationRange.value;
    MUTPROB = Number(mutationRange.value);
    resetSolve();
});