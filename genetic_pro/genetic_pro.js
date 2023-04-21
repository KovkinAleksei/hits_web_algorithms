const MUTPROB = 70;
const POPULATION = 10;
const CHILDS = 10;
const MIN_LEN = 1;
const MAX_LEN = 100;

const FIBAMOUNT = 20;

// Числа Фибоначи
let fibonacci = [];

// Заполнение массива чисел Фибоначи
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

// Скрещивание
function cross() {
    // Случайный выбор родителей
    let first = randInt(0, solves.length);
    let second = randInt(0, solves.length);

    // Случайный выбор разделителя в генах
    let minLen = Math.min(solves[first].operationIndexes.length, solves[second].operationIndexes.length);
    let cut1 = randInt(0, minLen);
    let cut2 = randInt(0, minLen);

    // Первый потомок
    var firstChild = {
        operationIndexes: solves[first].operationIndexes.slice(0, cut1 + 1).concat(solves[second].operationIndexes.slice(cut1 + 1, cut2)).concat(solves[first].operationIndexes.slice(cut2 + 1, 
            solves[first].operationIndexes.length)),
        fitness: Infinity,
        code: ""
    };

    // Мутация первого потомка
    if (Math.random() * 100 < MUTPROB) {
        for (let a = 0; a < firstChild.operationIndexes.length / 4; a++) {
            firstChild.operationIndexes[randInt(0, firstChild.operationIndexes.length)] = randInt(0, operations.length);
        }
    }

    // Генерация алгоритма первого потомка
    for (let i = 0; i < firstChild.operationIndexes.length; i++) {
        firstChild.code += operations[firstChild.operationIndexes[i]];
    }

    // Нахождение приспособленности первого потомка
    firstChild.fitness = calculateFitness(firstChild);

    // Второй потомок
    var secondChild = {
        operationIndexes: solves[second].operationIndexes.slice(0, cut1 + 1).concat(solves[first].operationIndexes.slice(cut1 + 1, cut2)).concat(solves[second].operationIndexes.slice(cut2 + 1, 
            solves[second].operationIndexes.length)),
        fitness: Infinity,
        code: ""
    };

    // Мутация второго потомка
    if (Math.random() * 100 < MUTPROB) {
        for (let a = 0; a < secondChild.operationIndexes.length / 4; a++) {
            secondChild.operationIndexes[randInt(0, secondChild.operationIndexes.length)] = randInt(0, operations.length);
        }
    }

    // Генерация алгоритма второго потомка
    for (let i = 0; i < secondChild.operationIndexes.length; i++) {
        secondChild.code += operations[secondChild.operationIndexes[i]];
    }

    // Нахождение приспособленности второго потомка
    secondChild.fitness = calculateFitness(secondChild);

    // Добавление потомков в популяцию
    solves.push(firstChild);
    solves.push(secondChild);
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

    const interval = setInterval(function() {
        // Добавление детей в популяцию
        for (let j = 0; j < CHILDS; j++) {
            cross();
        }
    
        // Сортировка решений в популяции по их приспособленности
        sortSolves();
    
        // Удаление лишних решений из популяции
        for (let k = 0; k < CHILDS * 2; k++) {
            solves.pop();
        }
    
        display.innerHTML = `let a = 0;<br>let b = 0;<br>let c = 0;<br>let result = 0;<br>` + solves[0].code.replace(/\n/gi, '<br>') + `result = a + b;<br>`;
    }, 10);
});
