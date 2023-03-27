import { drawer, startDrawing, stopDrawing, startDBSCAN, startKMeans, getAllPointsBlack } from "./drawFunctions.js";
export { pointCoordinates, ctx };

export let nowButton = 0;
export let countClusters = 3;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

document.getElementById('rangeValue').textContent = "Количество кластеров: 3";
canvas.width = 1000;
canvas.height = 600;

let pointCoordinates = [];

document.getElementById('canvas').addEventListener('click', (e) => { drawer(e) });

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
    window.location.reload() 
});

document.getElementById('dbscanButton').addEventListener('click', () => {
    startDBSCAN();
});

document.getElementById('kMeansButton').addEventListener('click', () => {
    startKMeans();
});

document.getElementById('canvas').addEventListener('mousedown', startDrawing);
document.getElementById('canvas').addEventListener('mouseup', stopDrawing);
document.getElementById('canvas').addEventListener('mouseleave', stopDrawing);