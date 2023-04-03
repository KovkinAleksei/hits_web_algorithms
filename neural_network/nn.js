
let weights = [
    [
],
    [
]
];

let biases = [
    [

    ],
    [

    ]
];

// Сигмоида
function sigmoid(x) {
    return 1 / (1 + Math.exp( -x ));
}

// Производная сигмоиды
function sigmoidPrime(x) {
    return sigmoid(x) * (1 - sigmoid(x));
}

// умножение матриц
function matrixMultiplication(a, b) {
    let result = Array(a.length).fill().map(() => [])
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j]
            }
            result[i][j] = sum;
        }
    }
    return result;
}

// сложение матриц
function matrixAddition(a, b) {
    let result = Array(a.length).fill().map( () => [])
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a[0].length; j++) {
            result[i][j] = sigmoid(a[i][j] + b[i][j]);
        }
    }

    return result;
}

export function feedforward(a) {
    for (let k = 0; k < 2; k++) {
        a = matrixAddition(matrixMultiplication(weights[k], a), biases[k]);
    }
    return a;
}