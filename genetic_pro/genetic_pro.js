const MUTPROB = 70;
const POPULATION = 100;
const CHILDS = 200;
const MIN_LEN = 1;
const MAX_LEN = 70;

const FIBAMOUNT = 10;

// Числа Фибоначи
let fibonacci = [];

function getFibonacciNumbers() {
    for (let a = 0, b = 1, i = 0; i < FIBAMOUNT; i++, [a, b] = [b, a + b]){
        fibonacci.push(a);
    }
}

// Генерация случайного числа в диапозоне min-max
function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.ceil(max);

    return Math.floor(Math.random() * (max - min)) + min;
}

// Строки кода, из которых генерируются решения
const operations = [
    "a++;\n", "a--;\n", "b++;\n", "b--;\n", "c++;\n", "c--;\n", "[a, b] = [b, a + b];\n",
    "[b, c] = [c, a+b];\n", "[b, c] = [a, a+b];\n", "[a, b] = [c, a+b];\n", "[a, b] = [b-a, a];\n",
    "[a, c] = [c, a];\n", 
    "for (let i = 0; i < n; i++)\n  [a, b] = [b, a + b];\n",
    "for (let i = 0; i < n; i++)\n  [a, c] = [c, a + b];\n",
    "for (let i = 0; i < n; i++)\n  [a, b] = [b, c + b];\n"
]

// Решение в популяции
let solves = [];

// Нахождение приспособленности решения
function calculateFitness(currentSolve) {
    let result = 0;
    let summ = 0;

    let fitness = 0;

    try{
        for (let i = 0; i < FIBAMOUNT; i++) {
            let n = 0;
            let a = 0; 
            let b = 0;
            let c = 0;
            result = 0;

            let fullCode = `n = ${i + 1};\na = 0;\nb = 0;\nc = 1;\n result = 0;\n` + currentSolve.code + `result = a + b;\n`;
            eval(fullCode);
            summ += Math.abs(fibonacci[i] - result);
        }

        fitness = summ;
    }
    catch{
        fitness = Infinity;
    }

    return fitness;
}

// Генерация случайного решения
function generateSolve() {
    for (let i = 0; i < POPULATION; i++) {
        let currentSolve = {
            operationIndexes: new Array(randInt(MIN_LEN, MAX_LEN)),
            fitness: Infinity,
            code: ""
        };

        for (let j = 0; j < currentSolve.operationIndexes.length; j++) {
            currentSolve.operationIndexes[j] = randInt(0, operations.length);
            currentSolve.code += operations[currentSolve.operationIndexes[j]];
        }

        currentSolve.fitness = calculateFitness(currentSolve);

        solves.push(currentSolve);
    }
}

// Сортировка решений в популяции по их приспособленности
function sortSolves() {
    for (let i = 0; i < solves.length; i++) {
        for (let j = i + 1; j < solves.length; j++) {
            if (solves[i].fitness > solves[j].fitness) {
                let temp = solves[i];
                solves[i] = solves[j];
                solves[j] = temp;
            }
        }
    }
}

// Экран вывода алгоритма
let display = document.getElementById("container");

// Запуск генетического алгоритма
const startButton = document.getElementById("startButton");

startButton.addEventListener('click', (e) => {
    solves = [];

    // Нахождение чисел Фибоначи для проверки алгоритмов
    getFibonacciNumbers();

    // Генерация начальной популяции
    generateSolve();

    // Сортировка решений в популяции по их приспособленности
    sortSolves();

    console.log(solves);
    display.innerHTML = solves[0].code.replace(/\n/gi, '<br>');
});
