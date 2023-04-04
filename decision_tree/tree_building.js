import {getTreeNodes, getColumn, getUniqueElements, data} from "./entropy_calculation.js";

// Атрибуты для построения дерева
let attributeNodes = [];

// Вершина дерева
class Node {
    constructor(nodeName, attribute) {
        this.nodeName = nodeName;    // Название вершины
        this.branches = [];          // Ответвления от вершины
        this.attribute = attribute;  // Атрибут вершины
    }
}

// Нахождение результата прохода по дереву
function getAnswer(atr, result) {
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

// Добавление ветвей дерева
function growBranch(queue) {
    // Индекс добавляемой вершины
    let currentIndex = 1;

    // Взятие текущей вершины
    while (queue && currentIndex < attributeNodes.length) {
        let currentNode = queue.shift();

        // Нахождение всех ответвлений от текущей вершины
        let uniqueElements = getUniqueElements(getColumn(data, attributeNodes[currentIndex].index));

        // Добавление ответвлений к текущей вершине
        for (let i = 0; i < uniqueElements.length; i++) {
            if (currentIndex < attributeNodes.length) {
                currentNode.branches.push(new Node(
                    `${currentNode.attribute.name} = ${getUniqueElements(getColumn(data, currentNode.attribute.index))[i]}`, 
                attributeNodes[currentIndex]));

                queue.push(currentNode.branches[i]);
                currentIndex++;
            }
        }
    }
}

// Добавление листьев к дереву
function addLeaves(currentNode) {
    // Проход по дереву до листьев
    if (currentNode.branches.length != 0) {
        for (let i = 0; i < currentNode.branches.length; i++) {
            addLeaves(currentNode.branches[i]);
        }
    }
    // Добавление листьев
    else {
        // Нахождение возможных результатов прохода по дереву до текущего листа
        let results = getUniqueElements(getColumn(data, currentNode.attribute.index));

        for (let j = 0; j < results.length; j++) {
            // Добавление листьев
            currentNode.branches.push(new Node(`${currentNode.attribute.name} = ${results[j]}`, 
                currentNode.attribute));

            // Добавление результата прохода по дереву до текущего листа
            currentNode.branches[j].branches.push(new Node(`${data[0][data[0].length - 1]} = ${getAnswer(currentNode.attribute, results[j])}`));
        }
    }
}

// Создание дерева
export function makeTree(input) {
    // Нахождение последовательности атрибутов для построения дерева
    attributeNodes = getTreeNodes(input, 0);
    console.log(attributeNodes);

    // Создание корня дерева
    let root = new Node('root', attributeNodes[0], attributeNodes[0]);

    // Добавление корня в очередь вершин
    let queue = [];
    queue.push(root);

    // Добавление ветвей дерева
    growBranch(queue);

    // Добавление листьев к дереву
    addLeaves(root);
    console.log(root);

    return root;
}