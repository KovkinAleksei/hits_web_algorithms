import { readFile } from "./parse_cvs_file.js";
import { makeTree } from "./tree_building.js";
import { data, getUniqueElements } from "./entropy_calculation.js";
import { getData } from "./data.js"

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
let chosenFileIndex = null;

// Построение дерева решений
makeTreeButton.addEventListener('click', (e) => {
    // Очистка поля
    resetTree();

    let fileInput = [];  // Файл
    let data = [];       // Текст из файла
    treeRoot = null;     // Корень дерева

    if (file.value === '' && !chosenFileIndex){
        alert('Файл не загружен');
    }
    else if (file.value != '') {
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

            document.getElementById("root").style.zoom = 2;
        }
    }
    else {
        // Построение дерева решений
        treeRoot = makeTree(getData(chosenFileIndex));

        // Отображение дерева решений
        let treeRootElement = document.getElementById("root");
        displayTree(treeRoot, treeRootElement);

        document.getElementById("root").style.zoom = 2;
    }
});

let bypassTreeButton = document.getElementById("bypassTree");

let bypassIndex;
let bypassInterval;

// Обход дерева
function bypassTree(currentNode, data) {
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
    clearInterval(bypassInterval);
    bypassInterval = null;

    bypassIndex  = 1;
    let cNode = null;

    if (document.getElementById("root").innerHTML != "") {
        bypassInterval = setInterval(function() {
            cNode = bypassTree(cNode, data);
        }, 100);
    }
});

let reduceTreeButton = document.getElementById("reduceTree");

// Сокращение размера дерева
reduceTreeButton.addEventListener('click', (e) => {
    // Отмена сокращения невыведенного дерева
    if (document.getElementById("root").innerHTML == '') {
        return;
    }

    // Сокращение размера дерева
    reduceTree(treeRoot);

    // Обновление отображения дерева
    resetTree();

    let treeRootElement = document.getElementById("root");
    displayTree(treeRoot, treeRootElement);
});

// Сокращение высоты дерева
function reduceTree(currentNode) {
    // Возврат значения листа
    if (currentNode.branches.length == 1) {
        let arr = [];
        arr.push(currentNode.branches[0].atrValue);

        return arr;
    }

    // Нахождение всех значений ветвей текущей вершины
    let answers = [];

    for (let i = 0; i < currentNode.branches.length; i++) {
            let branchesAnswers = reduceTree(currentNode.branches[i]);

            for (let k = 0; k < branchesAnswers.length; k++) {
                answers.push(branchesAnswers[k]);
            }
    }

    // Сокращение вершины до листа, если значения листьев всех её ветвей одинаковые
    if (getUniqueElements(answers).length == 1) {
        currentNode.branches = [currentNode.branches[0].branches[0]];
    }

    return answers;
}

let userBypassButton = document.getElementById("userBypass");

// Обход дерева по введённым пользоавтелем данным
userBypassButton.addEventListener('click', (e) => {
    clearInterval(bypassInterval);
    bypassInterval = null;

    let userData = document.getElementById("userInput").value.split(' ');

    bypassIndex  = 1;
    let cNode = null;

    if (document.getElementById("root").innerHTML != "") {
        bypassInterval = setInterval(function() {
            cNode = bypassTree(cNode, [userData, userData]);
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

// Выбор файла infection
let infectionButton = document.getElementById("infectionButton");

infectionButton.addEventListener('click', (e) => {
    file.value = '';
    chosenFileIndex = 1;
});

// Выбор файла THAP
let thapButton = document.getElementById("thapButton");

thapButton.addEventListener('click', (e) => {
    file.value = '';
    chosenFileIndex = 2;
});

// Выбор файла weather
let weatherButton = document.getElementById("weatherButton");

weatherButton.addEventListener('click', (e) => {
    file.value = '';
    chosenFileIndex = 3;
});