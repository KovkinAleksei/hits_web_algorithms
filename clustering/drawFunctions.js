import { nowButton, pointCoordinates, countClusters, countClustersHierarchical, searchRadius, pointsCount, canvasKMeans, ctx, ctx2, ctx3} from "./main.js";
import { Point } from "./pointClass.js";
import { dbscan } from "./DBSCAN.js";
import { kMeans } from "./kMeans.js";
import { hierarchicalClustering } from "./hierarchical.js";
export { drawer, startDrawing, stopDrawing, startDBSCAN, startKMeans, findNearestPointIndex, getAllPointsBlack, startHierarchical, startAllAlgorithms};


const colors = [
    'rgb(0, 0 ,100)',
    'rgb(0, 0 ,200)',
    'rgb(0, 100 ,0)',
    'rgb(0, 100 ,100)',
    'rgb(0, 100 ,200)',
    'rgb(0, 200 ,0)',
    'rgb(0, 200 ,100)',
    'rgb(0, 200 ,200)',
    'rgb(100, 0 ,0)',
    'rgb(100, 0 ,100)',
    'rgb(100, 0 ,200)',
    'rgb(100, 100 ,0)',
    'rgb(100, 100 ,100)',
    'rgb(100, 100 ,200)',
    'rgb(100, 200 ,0)',
    'rgb(100, 200 ,100)',
    'rgb(100, 200 ,200)',
    'rgb(200, 0 ,0)',
    'rgb(200, 0 ,100)',
    'rgb(200, 0 ,200)',
    'rgb(200, 100 ,0)',
    'rgb(200, 100 ,100)',
    'rgb(200, 100 ,200)',
    'rgb(200, 200 ,0)',
    'rgb(200, 200 ,100)',
    'rgb(200, 200 ,200)',
];

const blackColor = 'rgb(0, 0, 0)'
const canvasColor = '#ceccc6';
const MAXVALUE = 100000000;
const RADIUS = 7;
const minDistanceBetweenPoint = 14;
let algorithm = 1;

function startAllAlgorithms() {
    if (countClusters > pointCoordinates.length){
        alert("Слишком мало точек для такого количества кластеров. Нарисуйте больше. (K-Means)");
        return;
    }
    else if (countClustersHierarchical > pointCoordinates.length){
        alert("Слишком мало точек для такого количества кластеров. Нарисуйте больше. (Hierarchical)");
        return;
    }
    startKMeans();
    startDBSCAN();
    startHierarchical();
}

function startKMeans () {
    resetSolve();
    algorithm = 1;
    let kmeans = kMeans(countClusters);
    drawClusters(kmeans.clusters);
    drawCentroids(kmeans.centroids);
}

function startDBSCAN (){
    algorithm = 2;
    getDbscanBlack();
    drawClusters(dbscan(pointCoordinates, searchRadius, pointsCount));
}

function startHierarchical() { 
    algorithm = 3;
    drawClusters(hierarchicalClustering(pointCoordinates, countClustersHierarchical));
}

function drawCentroids(centroids) { 
    let crossSize = 7;
    for (let i = 0; i < centroids.length; i++) {
        ctx.beginPath();
        ctx.moveTo(centroids[i].x - crossSize, centroids[i].y - crossSize);
        ctx.lineTo(centroids[i].x + crossSize, centroids[i].y + crossSize);
        ctx.moveTo(centroids[i].x + crossSize, centroids[i].y - crossSize);
        ctx.lineTo(centroids[i].x - crossSize, centroids[i].y + crossSize);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;
        ctx.stroke();
    }
}

function drawClusters(clusters){
    for (let i = 0; i < clusters.length; i++) {
        let colorIndex = Math.floor((Math.random() * colors.length / clusters.length) + (colors.length / clusters.length * i));
        for (let j = 0; j < clusters[i].length; j++) { 
            let index = pointCoordinates.indexOf(clusters[i][j]);
            if (algorithm === 1) {
                pointCoordinates[index].drawKMeans(colors[colorIndex]);
            }
            else if (algorithm === 2) {
                pointCoordinates[index].drawDBSCAN(colors[colorIndex]);
            }
            else if (algorithm === 3){
                pointCoordinates[index].drawHierarchical(colors[colorIndex]);
            }
        }
    }
}

function drawer(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    if (nowButton === 1 && isDrawPossibility(x, y)) {
        addPoint(x, y);
    } 
    
    if (nowButton === 2){
        deletePoint(x, y);
    }
}

function addPoint(x, y) {
    pointCoordinates.push(new Point(x, y, RADIUS));
    pointCoordinates[pointCoordinates.length - 1].drawAndCopy();
}

function deletePoint(x, y) {
    let index = pointPresenceCheck(x, y);

    if (index !== null) {
        ctx.reset();
        ctx2.reset();
        ctx3.reset();
        pointCoordinates.splice(index, 1);
        for (let i = 0; i < pointCoordinates.length; i++){
            pointCoordinates[i].drawAndCopy("black");
        }
    }
}

function isDrawPossibility(x, y) {
    let index = findNearestPointIndex(x, y);

    if (index === null || findDistance(pointCoordinates[index].x, pointCoordinates[index].y, x, y) > minDistanceBetweenPoint 
    && x > RADIUS && x < canvasKMeans.clientWidth - RADIUS && y > RADIUS && y < canvasKMeans.clientHeight - RADIUS) {
        return true;
    }

    return false;
}

function pointPresenceCheck(x, y){
    let index = findNearestPointIndex(x, y);

    if (index !== null){
        if (findDistance(x, y, pointCoordinates[index].x, pointCoordinates[index].y) < RADIUS){
            return index;
        }
    }

    return null;
}

export function resetSolve() {
    ctx.reset();
    drawVertexes();
}

function getAllPointsBlack(){
    resetSolve();
    for (let i = 0; i < pointCoordinates.length; i++) {
        pointCoordinates[i].drawAndCopy(blackColor);
    }
}

function getDbscanBlack() {
    for (let i = 0; i < pointCoordinates.length; i++) {
        pointCoordinates[i].drawDBSCAN(blackColor);
    }
}

function findNearestPointIndex(x, y) {
    let minDistance = MAXVALUE;
    let index = null;

    for (let i = 0; i < pointCoordinates.length; i++) {
        let distance = findDistance(pointCoordinates[i].x, pointCoordinates[i].y, x, y);

        if (distance < minDistance) {
            index = i;
            minDistance = distance;
        }
    }

    return index;
}

function drawVertexes() {
    pointCoordinates.forEach(element => {
        ctx.beginPath();
        ctx.arc(element.x, element.y, RADIUS, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fill();
    });
}

function findDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function startDrawing() {
    document.getElementById('canvasKMeans').addEventListener('mousemove', drawer);
}

function stopDrawing() {
    document.getElementById('canvasKMeans').removeEventListener('mousemove', drawer);
}

export function returnToOriginalStage(){
    document.getElementById("addPointButton").style.opacity = 1;
    document.getElementById("removePointButton").style.opacity = 1;
}

export function changeAddButton(){
    document.getElementById("removePointButton").style.opacity = 1;
    document.getElementById("addPointButton").style.opacity = 0.6;
}

export function changeDeleteButton(){
    document.getElementById("addPointButton").style.opacity = 1;
    document.getElementById("removePointButton").style.opacity = 0.6;
}

