import {antColonyOptimization} from "./antMan.js";
import { handler, drawVertexes, startDrawing, stopDrawing } from "./drawFunctions.js";
import { returnToOriginalStage, changeAddButton, changeDeleteButton, offAllButtons } from "./buttonsHandler.js";

export const canv = document.getElementById("canvas");
export const ctx = canv.getContext('2d');

export let vertexes = [];
export let nowButton = 0;

export let ANTS = 50;
export let ITERATIONS = 200;
export let RHO = 0.5;

export let lines = false;

document.getElementById("findPathButton").addEventListener('click', (e) => {
    nowButton = 0;
    returnToOriginalStage();
    offAllButtons();
    antColonyOptimization(vertexes);
});


document.getElementById("addVertexButton").addEventListener('click', (e) => {
    if (nowButton === 0 || nowButton === 2) {
        nowButton = 1;
        changeAddButton();
    }
    else if (nowButton === 1) {
        nowButton = 0;
        returnToOriginalStage();
    }
});

document.getElementById("deleteVertexButton").addEventListener('click', (e) => {
    if (nowButton === 0 || nowButton === 1) {
        nowButton = 2;
        changeDeleteButton();
    }
    else if (nowButton === 2) {
        nowButton = 0;
        returnToOriginalStage();
    }
});

canv.addEventListener('click', (e) => {
    handler(e);
});

document.getElementById("clearButton").addEventListener('click', (e) => {
    ctx.reset();
    vertexes = [];
})

document.getElementById("inputRange").addEventListener('change', (e) => {
    document.getElementById("counter").innerHTML = inputRange.value;
    ANTS = inputRange.value;
});

document.getElementById("iterationRange").addEventListener('change', (e) => {
    document.getElementById("counterIteration").innerHTML = iterationRange.value;
    ITERATIONS = iterationRange.value;
});

document.getElementById("rhoRange").addEventListener('change', (e) => {
    document.getElementById("counterRHO").innerHTML = rhoRange.value;
    RHO = rhoRange.value;
});

getLines.addEventListener("change", function() {
    if (this.checked) {
        lines = true;
        ctx.reset();
        drawVertexes();
    } else {
        lines = false;
        ctx.reset();
        drawVertexes();
    }
});

document.getElementById('canvas').addEventListener('mousedown', startDrawing);
document.getElementById('canvas').addEventListener('mouseup', stopDrawing);
document.getElementById('canvas').addEventListener('mouseleave', stopDrawing);