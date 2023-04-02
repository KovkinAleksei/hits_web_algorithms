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

// Добавление ветвей дерева
function growBranch(currentNode, count) {
    // Остановка добавления ветвей
    if (count >= attributeNodes.length) {
        return;
    }

    // Нахождение всех ответвлений
    let uniqueElements = getUniqueElements(getColumn(data, attributeNodes[count].index));

    // Добавление ответвлений к текущей вершине
    for (let i = 0; i < uniqueElements.length; i++) {
        currentNode.branches.push(new Node(attributeNodes[count].name, attributeNodes[count]));
    }

    // Добавление следующий ответвлений
    for (let j = 0; j < currentNode.branches.length; j++) {
        growBranch(currentNode.branches[j], count + 1);
    }
}

// Создание дерева
function makeTree() {
    // Создание корня дерева
    let root = new Node(attributeNodes[0].name, attributeNodes[0]);

    // Добавление ветвей дерева
    growBranch(root, 1);
    console.log(root);
}

export function main(input) {
    // Нахождение последовательности атрибутов для построения дерева
    attributeNodes = getTreeNodes(input, 0);
    console.log(attributeNodes);

    // Построение дерева
    makeTree();
}