import { drawer, startDrawing, stopDrawing, startDBSCAN, startKMeans, getAllPointsBlack } from "./drawFunctions.js";
export { pointCoordinates, ctx, ctx2, ctx3 };

export let nowButton = 0;
export let countClusters = 3;

const canvasKMeans = document.getElementById('canvasKMeans');
const ctx = canvasKMeans.getContext('2d');
const canvasDBSCAN = document.getElementById('canvasDBSCAN');
const ctx2 = canvasDBSCAN.getContext('2d');
const canvas3 = document.getElementById('canvas3');
const ctx3 = canvas3.getContext('2d');

document.getElementById('rangeValue').textContent = "Количество кластеров: 3";

canvasKMeans.width = 400;
canvasKMeans.height = 400;
canvasDBSCAN.width = 400;
canvasDBSCAN.height = 400;
canvas3.width = 400;
canvas3.height = 400;

let pointCoordinates = [];

document.getElementById('canvasKMeans').addEventListener('click', (e) => { drawer(e) });

function handleRange() {
    const numberInput = document.getElementById('rangeKMeans');
    const number = parseInt(numberInput.value);
    if (isNaN(number) || number < 1 || number > 30) {
        alert("Ты дурак? Введи норм число");
        return;
    }
    countClusters = number;
}

document.getElementById('rangeKMeans').addEventListener('input', () => {
    handleRange();
    document.getElementById('rangeValue').textContent = "Количество кластеров: " + document.getElementById('rangeKMeans').value;
});

document.getElementById('doAllPointsBlack').addEventListener('click', (e) => {
    getAllPointsBlack();
});

document.getElementById('addPointButton').addEventListener('click', (e) => {
    nowButton = 1;
});

document.getElementById('removePointButton').addEventListener('click', (e) => {
    nowButton = 2;
});

document.getElementById('clearButton').addEventListener('click', () => {
    for (let i = 0; i < pointCoordinates.length; i++) { 
        pointCoordinates[i].draw("rgb(34, 131, 102)", 1); 
    }
    pointCoordinates = [];
});

document.getElementById('dbscanButton').addEventListener('click', () => {
    startDBSCAN();
});

document.getElementById('kMeansButton').addEventListener('click', () => {
    startKMeans();
});

document.getElementById('canvasKMeans').addEventListener('mousedown', startDrawing);
document.getElementById('canvasKMeans').addEventListener('mouseup', stopDrawing);
document.getElementById('canvasKMeans').addEventListener('mouseleave', stopDrawing);