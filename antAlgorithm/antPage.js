import {antColonyOptimization} from "./antMan.js";
import { handler, drawVertexes } from "./drawFunctions.js";

export const canv = document.getElementById("canvas");
export const ctx = canv.getContext('2d');

export let vertexes = [];
export let deleteMode = false;

export let ANTS = 50;
export let ITERATIONS = 200;
export let RHO = 0.5;

export let lines = false;

document.getElementById("findPathButton").addEventListener('click', (e) => {
    antColonyOptimization(vertexes);
});

document.getElementById("deleteVertexButton").addEventListener('click', (e) => {
    if (!deleteMode) {
        deleteMode = true;
    }
    else {
        deleteMode = false;
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