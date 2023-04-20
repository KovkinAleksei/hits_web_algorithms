import { showSolve} from "./drawFunctions.js";
import { ANTS, ITERATIONS, RHO } from "./antPage.js";
import { onAllButtons } from "./buttonsHandler.js";

const maxIterationWithoutChanges = 100;
const ALPHA = 2; //коэффициент влияния феромона
const BETA = 5; //коэффициент влияния эвристической информации

const MAXVALUE = 10000000;

export function sleep(milliseconds) { 
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export async function antColonyOptimization(vertexes) { 
    if (vertexes.length < 2) {
        alert("Поставьте хотя-бы 2 вершины графа");
        onAllButtons();
        return;
    }

    let k = 0;
    let bestPath = null;
    let bestPathLength = MAXVALUE;

    let distances = findMatrixDistances(vertexes); //рассчитываем расстояния
    let ants = createAnts(); //генерируем муравьев
    let pheromones = initiateStartPheromones(vertexes); //генерируем ферамоны

    for (let iteration = 0; iteration < ITERATIONS; iteration++) {
        document.getElementById("nowIteration").innerHTML = iteration;
        // рандомный выбор откуда начинает каждый муравей
        ants.forEach(function (ant) {
            ant.path = [];
            ant.visited = new Array(vertexes.length).fill(false);
            let startVertex = Math.floor(Math.random() * vertexes.length);
            ant.path.push(startVertex);
            ant.visited[startVertex] = true;
            ant.currentVertex = startVertex;
        });
    
        // выбор каждым муравьем следующей точки
        for (let i = 0; i < vertexes.length - 1; i++) {
            ants.forEach(function (ant) {
                let nextVertex = selectNextVertex(ant, ant.visited, pheromones, distances, vertexes);
                ant.path.push(nextVertex);
                ant.visited[nextVertex] = true;
                ant.currentVertex = nextVertex;
            });
        }
    
        // ищем лучший маршрут у каждого муравья
        ants.forEach(function (ant) {
            let pathLength = calculatePathLength(ant.path, distances);
            if (pathLength < bestPathLength) {
                bestPathLength = pathLength;
                bestPath = ant.path.slice();
                k = 0;
                showSolve(bestPath);
            }
        });
        await sleep(1);
        k++;
        if (k > maxIterationWithoutChanges) {
            break;
        }
        updatePheromones(pheromones, ants, distances, vertexes);
    }

    onAllButtons();
    showSolve(bestPath, "#0000ff");
}

//функция создания пустых муравьев
function createAnts() {
    let ants = [];
    for (let i = 0; i < ANTS; i++) {
        ants.push({ path: [], visited: [] });
    }
    return ants;
}

//составить матрицу расстояний от одной вершины до другой
function findMatrixDistances (vertexes){ 
    const distances = new Array(vertexes.length);

    for (let i = 0; i < vertexes.length; i++) { 
        distances[i] = new Array(vertexes.length);
        for (let j = 0; j < vertexes.length; j++) { 
            const X = vertexes[i].x - vertexes[j].x;
            const Y = vertexes[i].y - vertexes[j].y;
            distances[i][j] = Math.sqrt(X * X + Y * Y);
        }
    }
    return distances;
}

//расчитать количество начальных феромонов на каждом ребре
function initiateStartPheromones(vertexes) { 
    let pheromones = [];
    for (let i = 0; i < vertexes.length; i++) { 
        let row = [];
        for (let j = 0; j < vertexes.length; j++) { 
            row.push(1);
        }
        pheromones.push(row);
    }
    return pheromones;
}

//функция вероятности поменять маршрут
function changePathProbability(i, j, visited, pheromones, distances, vertexes) {
    let numerator = Math.pow(pheromones[i][j], ALPHA) * Math.pow(1 / distances[i][j], BETA);
    let denominator = 0;
    for (let k = 0; k < vertexes.length; k++) {
        if (!visited[k]) {
            denominator += Math.pow(pheromones[i][k], ALPHA) * Math.pow(1 / distances[i][k], BETA);
        }
    }
    return numerator / denominator;
}

//посчитать длину всего пути
function calculatePathLength(path, distances) {
    let pathLength = 0;
    for (let i = 0; i < path.length - 1; i++) {
        pathLength += distances[path[i]][path[i + 1]];
    }
    pathLength += distances[path[path.length - 1]][path[0]];

    return pathLength;
}

//обновить ферамоны
function updatePheromones(pheromones, ants, distances, vertexes) {
    for (let i = 0; i < vertexes.length; i++) {
        for (let j = i + 1; j < vertexes.length; j++) {
            let pheromone = 0;
            for (let k = 0; k < ants.length; k++) {
                let path = ants[k].path;
                let pathLength = calculatePathLength(path, distances);
                if (path.includes(i) && path.includes(j)) {
                    pheromone += 1 / pathLength;
                }
            }   
            pheromones[i][j] = (1 - RHO) * pheromones[i][j] + pheromone;
            pheromones[j][i] = pheromones[i][j];
        } 
    }
    return pheromones;
}

//выбор в какой город пойдет муравей
function selectNextVertex(ant, visited, pheromones, distances, vertexes) {
    let i = ant.currentVertex;
    let probabilities = [];
    let denominator = 0;

    for (let j = 0; j < vertexes.length; j++) {
        if (!visited[j]) {
            let probability = changePathProbability(i, j, visited, pheromones, distances, vertexes);
            probabilities.push({vertex: j, probability: probability});
            denominator += probability;
        }
    }

    probabilities.forEach(function (p) { p.probability /= denominator; });
    let selected = probabilities[0].vertex;
    let rand = Math.random();

    for (let i = 0; i < probabilities.length; i++) {
        if (rand <= probabilities[i].probability) {
            selected = probabilities[i].vertex;
            break;
        }
        rand -= probabilities[i].probability;
    }

    return selected;
}
