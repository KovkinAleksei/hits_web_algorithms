import { readFile } from "./parse_cvs_file.js";
import { makeTree } from "./tree_building.js";
import { data } from "./entropy_calculation.js";

// Отображение дерева на странице
function displayTree(currentNode, treeElement) {
    // Создание новой вершины
    let newNode = document.createElement("li");
    let nodeName = currentNode.nodeName;

    // Добавление текста к новой вершине
    let newNodeText = document.createElement("span");
    newNodeText.textContent = nodeName;

    if (currentNode.isVisited) {
        newNodeText.style.backgroundColor = "red";
    }
    newNode.appendChild(newNodeText);

    // Добавление новой вершины к дереву
    treeElement.appendChild(newNode);

    // На листе продление ветки останавливается
    if (currentNode.branches.length == 0) {
        return;
    }

    // Добавление ветвей к новой вершине
    let newNodeBranch = document.createElement("ul");
    newNode.appendChild(newNodeBranch);

    for (let i = 0; i < currentNode.branches.length; i++) {
        displayTree(currentNode.branches[i], newNodeBranch);
    }
}

let file = document.getElementById("fileInput");
let makeTreeButton = document.getElementById("makeTree");
let treeRoot;

// Построение дерева решений
makeTreeButton.addEventListener('click', (e) => {
    // Очистка поля
    resetTree();

    let fileInput = [];  // Файл
    let data = [];       // Текст из файла
    treeRoot = null;     // Корень дерева

    if (file.value === ''){
        alert('Файл не загружен');
    }
    else {
        // Открытие файла
        fileInput = file.files[0];
        let reader = new FileReader();

        // Открытие файла
        reader.readAsText(fileInput);

        reader.onload = function () {
            // Чтение файла
            data = readFile(reader.result);

            // Построение дерева решений
            treeRoot = makeTree(data);

            // Отображение дерева решений
            let treeRootElement = document.getElementById("root");
            displayTree(treeRoot, treeRootElement);
        }
    }
});

let bypassTreeButton = document.getElementById("bypassTree");

let bypassIndex;
let bypassInterval;

// Обход дерева
function bypassTree(currentNode) {
    // Конец обхода
    if (bypassIndex == data.length) {
        clearInterval(bypassInterval);
        bypassInterval = null;

        return treeRoot;
    }

    // Проход через корень дерева
    if (currentNode == null) {
        treeRoot.isVisited = true;

        // Перекрашивание посещённой вершины
        resetTree();
        let treeRootElement = document.getElementById("root");
        displayTree(treeRoot, treeRootElement);
        treeRoot.isVisited = false;

        return treeRoot;
    }

    // Продолжение обхода
    for (let j = 0; j < currentNode.branches.length; j++) {
        // Нахождение следующей вершины
        if (data[bypassIndex][currentNode.attribute.index] == currentNode.branches[j].atrValue ||
            currentNode.branches.length == 1) {
            currentNode = currentNode.branches[j];
            currentNode.isVisited = true;

            // Перекрашивание посещённой вершины
            resetTree();
            let treeRootElement = document.getElementById("root");
            displayTree(treeRoot, treeRootElement);
            currentNode.isVisited = false;

            break;
        }
    }

    // Возврат следующей вершины
    if (currentNode.branches.length > 0) {
        return currentNode;
    }
    else {
        bypassIndex++;
        return null;
    }
}

// Запуск обхода дерева
bypassTreeButton.addEventListener('click', (e) => {
    bypassIndex  = 1;
    let cNode = null;

    if (document.getElementById("root").innerHTML != "") {
        bypassInterval = setInterval(function() {
            cNode = bypassTree(cNode);
        }, 100);
    }
});

let deleteTreeButton = document.getElementById("deleteTree");

// Вызов очистки поля по нажатию кнопки
deleteTreeButton.addEventListener('click', (e) => {
    clearInterval(bypassInterval);
    bypassInterval = null;

    resetTree();
});

// Очистка поля
function resetTree() {
    let rootElement = document.getElementById("root");
    rootElement.innerHTML = "";
}