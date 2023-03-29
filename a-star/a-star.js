import { map, sleep } from "./maze.js";

class Node {
    x
    y
    f
    g
    h
}

function isInside(x, y, size){
    return (x >= 0 && x < size && y >= 0 && y < size) ? true : false;
}

let finish = new Node();
finish.x = 20;
finish.y = 20;
async function aStar() {

    var size = document.getElementById('tableSize');

    // эвристика для алгоритма - Манхэттен
    function heuristic(v, end) {
        return Math.abs(v.x - end.x) + Math.abs(v.y - end.y)
    }

    // критерий сравнения двух узлов по f для сортировки
    function compare(a, b) {
        if (a.f < b.f)
            return -1;
        if (a.f > b.f)
            return 1;
        else
            return 0;
    }

    let size = document.getElementById('tableSize').value; // размерность таблицы

    // убрать ранее отрисованный путь, если таковой был
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = document.getElementById("table").rows[j].cells[i];
            cell.dataset.mode = (cell.dataset.mode == "path") ? "empty" : cell.dataset.mode;
        }
    }

    let start = new Node();
    start.x = 0;
    start.y = 0;

    let stNode = new Node();
    stNode.x = Number(start.x);
    stNode.y = Number(start.y);

    let openList = new Array; // список точек, подлежащих проверке
    openList.push(stNode)

    var usedList = new Array; // список уже проверенных точек

    let current = new Node();

    while (openList.length > 0) {
        openList.sort(compare); // отсортировать список доступных узлов в порядке убывания

        current = openList[0]; // взять в качестве текущего узла узел с min g
        await sleep(50);
        if (!(current.x == start.x && current.y == start.y) && !(current.x == finish.x && current.y == finish.y)) {
            document.getElementById("table").rows[current.y].cells[current.x].dataset.mode = "checking";
        }

        // если текущий узел = конечный, то выход
        if (current.x === finish.x && current.y === finish.y) {
            break;
        }

        openList.splice(openList.indexOf(current), 1);
        usedList.push(current);

        let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (var dir of directions) {
            var new_neighbour = new Node();
            new_neighbour.x = current.x + dir[0];
            new_neighbour.y = current.y + dir[1];

            // проверка наличия соседа узла в списке закрытых узлов
            var isClosed = usedList.find(el => (el.x === new_neighbour.x && el.y === new_neighbour.y));

            // проверка наличия соседа узла в списке доступных узлов
            var neighbour = openList.find(el => (el.x === new_neighbour.x && el.y === new_neighbour.y));

            // если сосед находится внутри поля, и не является стеной
            if (isInside(new_neighbour.x, new_neighbour.y, size) && map[new_neighbour.y][new_neighbour.x] === 0 && isClosed == null) {
                // если соседа не было в списке открытых узлов, то добавить его
                if (neighbour == null && typeof neighbour === "undefined") {

                    new_neighbour.g = current.g + 1;
                    new_neighbour.h = heuristic(new_neighbour, finish);
                    new_neighbour.f = new_neighbour.g + new_neighbour.h;

                    new_neighbour.parent = current; // откуда попали в соседа, из текущего узла
                    openList.push(new_neighbour);

                    //console.log(new_neighbour);
                }
                // иначе просто обновить предка соседа и его g
                else {
                    if (neighbour.g >= current.g + 1) {
                        openList[openList.indexOf(neighbour)].g = current.g + 1;
                        openList[openList.indexOf(neighbour)].parent = current;
                    }
                }

            }
        }
    }
}