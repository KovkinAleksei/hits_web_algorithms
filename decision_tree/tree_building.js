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
                currentNode.branches.push(new Node(attributeNodes[currentIndex].name, attributeNodes[currentIndex]));
                queue.push(currentNode.branches[i]);
                currentIndex++;
            }
        }
    }
}

// Создание дерева
export function makeTree(input) {
    // Нахождение последовательности атрибутов для построения дерева
    attributeNodes = getTreeNodes(input, 0);
    console.log(attributeNodes);

    // Создание корня дерева
    let root = new Node(attributeNodes[0].name, attributeNodes[0]);

    // Добавление корня в очередь вершин
    let queue = [];
    queue.push(root);

    // Добавление ветвей дерева
    growBranch(queue);
    console.log(root);

    return root;
}