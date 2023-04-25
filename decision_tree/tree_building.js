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
        this.isVisited = false;
    }
}

// Атрибут для создания вершины без ветвлений
const leafAttr = {name: "leafAttr", index: -1};

// Нахождение результата прохода по дереву
function getAnswer(atr, result, currentData) {
    if (currentData.length === 0) {
        return "leafAttr";
    }

    // Подсчёт кол-ва соответствующих уникальных классов выбранному значению атрибута
    let uniqueAnswers = getUniqueElements(getColumn(currentData, currentData[0].length - 1, 0));
    let answersCount = [];

    for (let i = 0; i < uniqueAnswers.length; i++) {
        answersCount.push(0);
    }

    for (let j = 0; j < currentData.length; j++) {
        for (let k = 0; k < uniqueAnswers.length; k++) {
            if (currentData[j][atr.index] === result && currentData[j][currentData[0].length - 1] === uniqueAnswers[k]) {
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

// Сортировка ветвей вершины по убыванию вероятности перехода на них
function sortBranches(column) {
    // Счёт вероятности перехода на ветви
    let results = [];
    let count = [];

    const uniqueRes = getUniqueElements(column);

    for (let i = 0; i < uniqueRes.length; i++) {
        results.push(uniqueRes[i]);
        count.push(0);
    }

    for (let j = 0; j < column.length; j++) {
        for (let k = 0; k < results.length; k++) {
            if (column[j] === results[k]) {
                count[k]++;
            }
        }
    }

    // Сортировка ветвей
    for (let a = 0; a < results.length; a++) {
        for (let b = a + 1; b < results.length; b++) {
            if (count[a] < count[b]) {
                let temp = count[a];
                count[a] = count[b];
                count[b] = temp;

                temp = results[a];
                results[a] = results[b];
                results[b] = temp;
            }
        }
    }

    return results;
}

// Добавление ветвей дерева
function growBranch(queue) {
    // Индекс добавляемой вершины
    let currentIndex = 1;

    // Взятие текущей вершины
    while (queue && currentIndex < attributeNodes.length) {
        let currentNode = queue.shift();

        // Нахождение всех ответвлений от текущей вершины
        let branches = sortBranches(getColumn(data, currentNode.attribute.index));

        // Добавление веток без уникальных атрибутов
        if (currentNode.branches.length === 0 && attributeNodes.length - currentIndex < branches.length) {
            for (let i = 0; i < branches.length - 1; i++) {
                attributeNodes.push(leafAttr);
            }
        }

        // Добавление ответвлений к текущей вершине
        for (let j = 0; j < branches.length; j++) {
            if (currentIndex < attributeNodes.length) {
                currentNode.branches.push(new Node(`${currentNode.attribute.name} = ${branches[j]}`, 
                    attributeNodes[currentIndex], branches[j]));
                queue.push(currentNode.branches[j]);
                currentIndex++;
            }
        }
    }
}

// Добавление листьев к дереву
function addLeaves(currentNode, currentData) {
    // Проход по дереву до листьев
    if (currentNode.branches.length != 0) {
        for (let i = 0; i < currentNode.branches.length; i++) {
            // Таблица для нахождения наиболее вероятного результата прохода по дереву
            let newData = currentData.slice();
            let deletedCount = 0;

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
        if (data.length === 0) {
            return;
        }

        // Нахождение возможных результатов прохода по дереву до текущего листа
        const results = getUniqueElements(getColumn(data, currentNode.attribute.index));
        
        for (let j = 0; j < results.length; j++) {
            // Добавление листьев
            if (currentNode.attribute != leafAttr){
            currentNode.branches.push(new Node(`${currentNode.attribute.name} = ${results[j]}`, 
                currentNode.attribute, results[j]));

                currentNode.branches[j].branches.push(new Node(`${data[0][data[0].length - 1]} = 
                ${getAnswer(currentNode.attribute, results[j], currentData)}`, null, 
                getAnswer(currentNode.attribute, results[j], currentData)));
            }
            else{
                currentNode.branches.push(new Node(`${data[0][data[0].length - 1]} = 
                ${getAnswer(currentNode.attribute, results[j], currentData)}`, null, 
                getAnswer(currentNode.attribute, results[j], currentData)));
            }
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