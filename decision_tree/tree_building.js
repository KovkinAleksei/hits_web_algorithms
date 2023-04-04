import {getTreeNodes, getColumn, getUniqueElements, data} from "./entropy_calculation.js";

// Атрибуты для построения дерева
let attributeNodes = [];

// Вершина дерева
class Node {
    constructor(nodeName, attribute, atrValue) {
        this.nodeName = nodeName;    // Название вершины
        this.branches = [];          // Ответвления от вершины
        this.attribute = attribute;  // Атрибут вершины
        this.atrValue = atrValue;    // Значение атрибута вершины
    }
}

// Нахождение результата прохода по дереву
function getAnswer(atr, result, data) {
    // Подсчёт кол-ва соответствующих уникальных классов выбранному значению атрибута
    let uniqueAnswers = getUniqueElements(getColumn(data, data[0].length - 1));
    let answersCount = [];

    for (let i = 0; i < uniqueAnswers.length; i++) {
        answersCount.push(0);
    }

    for (let j = 0; j < data.length; j++) {
        for (let k = 0; k < uniqueAnswers.length; k++) {
            if (data[j][atr.index] == result && data[j][data[0].length - 1] == uniqueAnswers[k]) {
                answersCount[k]++;
            }
        }
    }

    // Сортировка классов по убыванию частоты их вхождения
    for (let a = 0; a < uniqueAnswers.length; a++) {
        for (let b = a + 1; b < uniqueAnswers.length; b++) {
            if (answersCount[a] < answersCount[b]) {
                let temp = answersCount[a];
                answersCount[a] = answersCount[b];
                answersCount[b] = temp;

                temp = uniqueAnswers[a];
                uniqueAnswers[a] = uniqueAnswers[b];
                uniqueAnswers[b] = temp;
            }
        }
    }

    // Самый частовстречающийся класс считается результатом прохода по дереву
    return uniqueAnswers[0];
}

// Сортировка ветвей вершины в порядке убывания частоты появления значения их атрибутов
function sortBranches(node) {
    // Нахождение кол-во появлений значений атрибутов ветвей
    let elementsCount = [];

    for (let i = 0; i < node.branches.length; i++) {
        elementsCount.push(0);
    }

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < node.branches.length; j++) {
            if (data[i][node.attribute.index] == node.branches[j].atrValue) {
                elementsCount[j]++;
            }
        }
    }

    // Сортировка ветвей
    for (let a = 0; a < node.branches.length; a++) {
        for (let b = a + 1; b < node.branches.length; b++) {
            if (elementsCount[a] < elementsCount[b]) {
                let temp = elementsCount[a];
                elementsCount[a] = elementsCount[b];
                elementsCount[b] = temp;

                temp = Object.assign({}, node.branches[a]);
                //temp = node.branches[a];
                node.branches[a] = Object.assign({}, node.branches[b]);
                //node.branches[a] = node.branches[b];
                node.branches[b] = Object.assign({}, temp);
                //node.branches[b] = temp;
            }
        }
    }

    return node;
}

// Добавление ветвей дерева
function growBranch(queue) {
    // Индекс добавляемой вершины
    let currentIndex = 1;

    // Взятие текущей вершины
    while (queue && currentIndex < attributeNodes.length) {
        var currentNode = queue.shift();

        // Нахождение всех ответвлений от текущей вершины
        let uniqueElements = getUniqueElements(getColumn(data, attributeNodes[currentIndex].index));

        // Добавление ответвлений к текущей вершине
        for (let i = 0; i < uniqueElements.length; i++) {
            if (currentIndex < attributeNodes.length) {
                let branches = getUniqueElements(getColumn(data, currentNode.attribute.index));

                currentNode.branches.push(new Node(`${currentNode.attribute.name} = ${branches[i]}`, 
                    attributeNodes[currentIndex], branches[i]));
                queue.push(currentNode.branches[i]);
                currentIndex++;
            }
        }
    }
}

// Добавление листьев к дереву
function addLeaves(currentNode, currentData) {
    //currentNode = sortBranches(currentNode);

    // Проход по дереву до листьев
    if (currentNode.branches.length != 0) {
        for (let i = 0; i < currentNode.branches.length; i++) {
            // Таблица для нахождения наиболее вероятного результата прохода по дереву
            let newData = [];
            let deletedCount = 0;
            newData = currentData.slice();

            // Удаление из таблицы строк с неподходящими значениями атрибутов
            for (let j = 0; j < data.length; j++) {
                if (getUniqueElements(getColumn(data, currentNode.attribute.index))[i] != data[j][currentNode.attribute.index]) {
                    newData.splice(j - deletedCount, 1);
                    deletedCount++;
                }
            }

            // Продолжение прохода по дереву
            addLeaves(currentNode.branches[i], newData);
        }
    }
    // Добавление листьев
    else {
        // Нахождение возможных результатов прохода по дереву до текущего листа
        let results = getUniqueElements(getColumn(data, currentNode.attribute.index));

        for (let j = 0; j < results.length; j++) {
            // Добавление листьев
            currentNode.branches.push(new Node(`${currentNode.attribute.name} = ${results[j]}`, 
                currentNode.attribute, results[j]));

            // Добавление результата прохода по дереву до текущего листа
            currentNode.branches[j].branches.push(new Node(`${data[0][data[0].length - 1]} = 
                ${getAnswer(currentNode.attribute, results[j], currentData)}`, null, 
                getAnswer(currentNode.attribute, results[j], currentData)));
        }
    }
}

// Создание дерева
export function makeTree(input) {
    // Нахождение последовательности атрибутов для построения дерева
    attributeNodes = getTreeNodes(input, 0);

    // Создание корня дерева
    var root = new Node('root', attributeNodes[0], attributeNodes[0]);

    // Добавление корня в очередь вершин
    let queue = [];
    queue.push(root);

    // Добавление ветвей дерева
    growBranch(queue);

    // Добавление листьев к дереву
    addLeaves(root, data);

    return root;
}