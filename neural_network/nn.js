import { weights } from "./weights.js"
import { biases } from "./biases.js"

// Сигмоида
function sigmoid(x) {
    return 1 / (1 + Math.exp( -x ));
}

// умножение матриц
function matrixMultiplication(a, b) {
    let result = Array(a.length)
    for (let i = 0; i < a.length; i++) {
        let sum = 0;
        for (let j = 0; j < a[0].length; j++) {
            sum += a[i][j] * b[j]
        }
        result[i] = sum;
    }
    // console.log('mult ' + result);
    return result;
}

// сложение матриц
function matrixAddition(a, b) {
    let result = Array(a.length)
    for (let i = 0; i < a.length; i++) {
        result[i] = sigmoid(a[i] + b[i][0]);
    }
    // console.log('add ' + result);
    return result;
}

export function feedforward(matrix) {
    for (let k = 0; k < biases.length; k++) {
        matrix = matrixAddition(matrixMultiplication(weights[k], matrix), biases[k]);
    }
    // console.log(matrix)
    return matrix;
}