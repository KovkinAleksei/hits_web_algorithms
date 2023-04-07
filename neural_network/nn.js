import {weights, biases } from "./weights.js"

// Сигмоида
function sigmoid(x) {
    return 1 / (1 + Math.exp( -x ));
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

export function feedforward(matrix) {
    for (let k = 0; k < biases.length; k++) {
        matrix = matrixAddition(matrixMultiplication(weights[k], matrix), biases[k]);
    }
    console.log(matrix)
    return matrix;
}