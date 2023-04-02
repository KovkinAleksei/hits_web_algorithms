let data = []; // Таблица с данными

// Возврат массива с элементами столбца таблицы
function getColumn(matrix, columnIndex) {
    let column = [];

    for (let i = 0; i < matrix.length; i++) {
        column.push(matrix[i][columnIndex]);
    }

    return column;
}

// Удаление повторяющихся элементов из массива
function getUniqueElements(arr) {
    // Массив уникальных элементов
    let uniqueArr = [];

    // Добавление в массив уникальных элементов
    for (let i = 0; i < arr.length; i++) {
        if (!uniqueArr.includes(arr[i])) {
            uniqueArr.push(arr[i]);
        }
    }

    return uniqueArr;
}

// Нахождение вероятности вхождения класса в колонку
function getProbability(element, column) {
    let count = 0;

    // Нахождение кол-ва вхождений класса в колонку
    for (let i = 0; i < column.length; i++) {
        if (element == column[i]) {
            count++;
        }
    }

    // Нахождение вероятности вхождения класса в колонку
    return count / column.length;
}

// Нахождение энтропии в колонке
function calculateEntropy(column) {
    let entropy = 0;

    // Нахождение уникальных классов в колонке
    let uniqueClasses = getUniqueElements(column);

    // Нахождение энтропии для каждого из уникальных классов
    for (let i = 0; i < uniqueClasses.length; i++) {
        let probability = getProbability(uniqueClasses[i], column);
        entropy += probability * Math.log2(probability);
    }

    return entropy * -1;
}

// Составление матрицы с колонкой, состоящей из уникальных элементов
function getUniqueMatrix(columnIndex, columnValue) {
    let uniqueMatrix = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i][columnIndex] == columnValue) {
            uniqueMatrix.push(data[i]);
        }
    }

    return uniqueMatrix;
}

// Нахождение величины информации в колонке
function calculateInformationGain(column, columnIndex) {
    let uniqueClasses = getUniqueElements(column); // Уникальные классы в колонке
    let entropySumm = 0;                           // Сумма энтропий уникальных классов в колонке

    // Нахождение энтропии для каждого уникального класса колонки
    for (let i = 0; i < uniqueClasses.length; i++) {
        let probability = getProbability(uniqueClasses[i], column);
        let uniqueMatrix = getUniqueMatrix(columnIndex, uniqueClasses[i]);
        let currentEntropy = probability * calculateEntropy(getColumn(uniqueMatrix, uniqueMatrix[0].length - 1));

        // Суммирование найденных энтропий
        entropySumm += currentEntropy;
    }

    // Нахождение величины информации в колонке
    let informationGain = calculateEntropy(getColumn(data, data[0].length - 1)) - entropySumm;

    return informationGain;
}

// Алгоритм построения дерева решений
export function main(input) {
    data = input;

    let test = calculateInformationGain(getColumn(data, 1), 1);
}