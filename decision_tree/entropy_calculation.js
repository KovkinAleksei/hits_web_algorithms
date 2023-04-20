export let data = []; // Таблица с данными

// Возврат массива с элементами столбца таблицы
export function getColumn(matrix, columnIndex, start = 1) {
    let column = [];

    for (let i = start; i < matrix.length; i++) {
        column.push(matrix[i][columnIndex]);
    }

    return column;
}

// Удаление повторяющихся элементов из массива
export function getUniqueElements(arr) {
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
        if (data[i][columnIndex] == columnValue || i == 0) {
            uniqueMatrix.push(data[i]);
        }
    }

    return uniqueMatrix;
}

// Нахождение величины информации в колонке
function calculateInformationGain(column, columnIndex) {
    let uniqueClasses = getUniqueElements(column); // Уникальные классы в колонке

    if (column.length / uniqueClasses.length < 2) {
        return -999;
    }

    let entropySumm = 0;    // Сумма энтропий уникальных классов в колонке

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

// Нахождение всех атрибутов
function getAttributes(informationGains) {
    let attributes = [];

    for (let i = 0; i < data[0].length - 1; i++) {
        if (informationGains[i] != -999){
        attributes.push({name: data[0][i], index: i});
        }
    }

    return attributes;
}

// Сортировка атрибутов по уменьшению их информационной энтропии
function sortAttributes(attributes, informationGain) {
    for (let i = 0; i < attributes.length; i++) {
        for (let j = i + 1; j < attributes.length; j++) {
            if (informationGain[i] < informationGain[j]) {
                let temp = attributes[i];
                attributes[i] = attributes[j];
                attributes[j] = temp;

                temp = informationGain[i];
                informationGain[i] = informationGain[j];
                informationGain[j] = temp;
            }
        }
    }
}

// Нахождение последовательности атрибутов для построения дерева
export function getTreeNodes(input) {
    data = input;               // Таблица с данными
    var informationGains = [];  // Информационная энтропия атрибутов

    // Вычисление информационной энтропии для каждого атрибута
    for (let i = 0; i < data[0].length - 1; i++) {
        let idk = calculateInformationGain(getColumn(data, i), i);
        informationGains.push(idk);
    }

    // Нахождение всех атрибутов
    var attributes = getAttributes(informationGains);

    // Удаление лишних атрибутов
    let deletedCount = 0;

    for (let j = 0; j < informationGains.length; j++) {
        if (informationGains[j - deletedCount] == -999){
            informationGains.splice(j - deletedCount, 1);
            deletedCount++;
        }
    }

    // Сортировка атрибутов по уменьшению их информационной энтропии
    sortAttributes(attributes, informationGains);

    return attributes;
}