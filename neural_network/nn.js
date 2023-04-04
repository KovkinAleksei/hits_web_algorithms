const COUNT_OF_LAYERS = 3;

let weights = new Array(3);
weights[0] = new Array(28);
weights[1] = new Array(16);
weights[2] = new Array(10);

for(let i = 0; i < 28; i++) {
    weights[0][i] = new Array(784 * 28);
    for(let j = 0; j < 784 * 28; j++) {
        weights[0][i][j] = Math.random() * 2 - 1;
    }
}
for(let i = 0; i < 16; i++){
    weights[1][i] = new Array(28 * 16);
    for(let j = 0; j < 28 * 16; j++){
        weights[1][i][j] = Math.random() * 2 - 1;
    }
}
for(let i = 0; i < 10; i++) {
    weights[2][i] = new Array(16 * 10);
    for(let j = 0; j < 16 * 10; j++){
        weights[2][i][j] = Math.random() * 2 - 1;
    }
}

let biases = new Array(3);
biases[0] = new Array(28);
biases[1] = new Array(16);
biases[2] = new Array(10);

for(let i = 0; i < 28; i++) {
    biases[0][i] = Math.random() * 2 - 1;
}
for(let i = 0; i < 16; i++){
    biases[1][i] = Math.random() * 2 - 1;
}
for(let i = 0; i < 10; i++) {
    biases[2][i] = Math.random() * 2 - 1;
}

// Сигмоида
function sigmoid(x) {
    return 1 / (1 + Math.exp( -x ));
}

// Производная сигмоиды
function sigmoidPrime(x) {
    return sigmoid(x) * (1 - sigmoid(x));
}

// Умножение матриц
function matrixMultiplication(a, b) {
    let result = [];
    console.log(a)
    for (let i = 0; i < a[0].length; i++) {
        let sum = 0;
        for (let k = 0; k < a.length; k++) {
            sum += a[k][i] * b[k]
        }
        result[i] = sum;
    }
    return result;
}

// Сложение матриц
function matrixAddition(a, b) {
    let result = [];
    for (let i = 0; i < a.length; i++) {
            result[i] = sigmoid(a[i] + b[i]);
    }
    return result;
}

export function feedforward(matrix) {
    for (let k = 0; k < COUNT_OF_LAYERS; k++) {
        matrix = matrixAddition(matrixMultiplication(weights[k], matrix), biases[k]);
        console.log(k + " " + matrix)
    }
    return matrix;
}