import { readFile } from "./parse_cvs_file.js";
import { makeTree } from "./tree_building.js";

let file = document.getElementById("fileInput");
let makeTreeButton = document.getElementById("makeTree");

// Отображение дерева на странице
function displayTree(currentNode, treeElement) {
    // Создание новой вершины
    let newNode = document.createElement("li");
    let nodeName = currentNode.nodeName;

    // Добавление текста к новой вершине
    let newNodeText = document.createElement("a");
    newNodeText.href = "#";
    newNodeText.textContent = nodeName;
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

// Построение дерева решений
makeTreeButton.addEventListener('click', (e) => {
    let fileInput = [];  // Файл
    let data = [];       // Текст из файла
    let treeRoot;        // Корень дерева

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