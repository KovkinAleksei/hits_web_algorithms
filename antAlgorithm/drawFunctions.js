import { vertexes, canv, ctx, deleteMode, lines } from "./antPage.js";
const RADIUS = 10;
const MAXVALUE = 10000000;

export function drawVertexes() {
    vertexes.forEach(element => {
        ctx.beginPath();
        ctx.arc(element.x, element.y, RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    });

    if (lines) { 
        drawLines() 
    }
}

export function handler (event) {
    let xPos = event.offsetX;
    let yPos = event.offsetY;

    if (!deleteMode){
        drawOneVertex(xPos, yPos);
    } else {
        deleteVertex(xPos, yPos);
    }
}

export function showSolve(solve, color = "white") { 
    ctx.reset();
    
    for (let i = 0; i < solve.length - 1; i++) {
        ctx.moveTo(vertexes[solve[i]].x, vertexes[solve[i]].y);
        ctx.lineTo(vertexes[solve[i + 1]].x, vertexes[solve[i + 1]].y);
        ctx.strokeStyle = color;
        ctx.lineWidth = "4";
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.beginPath();
    }

    ctx.moveTo(vertexes[solve[solve.length - 1]].x, vertexes[solve[solve.length - 1]].y);
    ctx.lineTo(vertexes[solve[0]].x, vertexes[solve[0]].y);
    ctx.strokeStyle = color;
    ctx.lineWidth = "4";
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();

    drawVertexes();
}

function drawOneVertex(xPos, yPos) { 
    if (drawPossibility(xPos, yPos)) {
        vertexes.push({x: xPos, y: yPos});
        resetSolve();
        ctx.beginPath();
        ctx.arc(xPos, yPos, RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function deleteVertex(xPos, yPos) {
    let nearestVertex = findNearestPointIndex(xPos, yPos);
    if (Math.abs(vertexes[nearestVertex].x - xPos) <= RADIUS && Math.abs(vertexes[nearestVertex].y - yPos) <= RADIUS) {
        vertexes.splice(nearestVertex, 1);
        resetSolve();
    }
}

function resetSolve() {
    let ctx = canv.getContext('2d');
    ctx.reset();
    drawVertexes();
}

//нужно добавить фичу
function drawLines() {

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

function findDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function drawPossibility(x, y) {
    let index = findNearestPointIndex(x, y);

    return (index == MAXVALUE || findDistance(vertexes[index].x, vertexes[index].y, x, y) > 2 * RADIUS + 2 && x > RADIUS && x < canv.clientWidth - RADIUS && y > RADIUS && y < canv.clientHeight - RADIUS);
}
