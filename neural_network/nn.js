import {weights, biases} from "./weights.js"

const COUNT_OF_LAYERS = 3;

// let weights = new Array(3);
// weights[0] = new Array(128);
// weights[1] = new Array(56);
// weights[2] = new Array(10);

// for(let i = 0; i < 128; i++) {
//     weights[0][i] = new Array(784 * 128);
//     for(let j = 0; j < 784 * 128; j++) {
//         weights[0][i][j] = Math.random() * 2 - 1;
//     }
// }
// for(let i = 0; i < 16; i++){
//     weights[1][i] = new Array(128 * 56);
//     for(let j = 0; j < 128 * 56; j++){
//         weights[1][i][j] = Math.random() * 2 - 1;
//     }
// }
// for(let i = 0; i < 10; i++) {
//     weights[2][i] = new Array(56 * 10);
//     for(let j = 0; j < 56 * 10; j++){
//         weights[2][i][j] = Math.random() * 2 - 1;
//     }
// }

// let biases = new Array(3);
// biases[0] = new Array(128);
// biases[1] = new Array(56);
// biases[2] = new Array(10);

// for(let i = 0; i < 28; i++) {
//     biases[0][i] = Math.random() * 2 - 1;
// }
// for(let i = 0; i < 16; i++){
//     biases[1][i] = Math.random() * 2 - 1;
// }
// for(let i = 0; i < 10; i++) {
//     biases[2][i] = Math.random() * 2 - 1;
// }

// Сигмоида
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

// Производная сигмоиды
function sigmoidPrime(x) {
    return sigmoid(x) * (1 - sigmoid(x));
}

// Умножение матриц
function matrixMultiplication(a, b) {
    let result = Array(a.length).fill().map(() => [])
    console.log('a')
    console.log(a)
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < 28*28; j++) {
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
function matrixAddition(a, b, func=function(x) {return x}) {
    let result = Array(a.length).fill().map( () => [])
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < 28*28; j++) {
            result[i][j] = func(a[i][j] + b[i][j]);
        }
    }

    return result;
}


export function feedforward(matrix) {
    console.log('matrix')
    console.log(matrix)
    for (let k = 0; k < 2; k++) {
        matrix = matrixAddition(matrixMultiplication(weights[k], matrix), biases[k]);
        console.log('matrix')
        console.log(matrix)
    }
    return matrix;
}