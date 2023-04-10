import { map } from "./table.js";
import { disableButtons, enableButtons, isInside, sleep, clearPath } from "./a-star_functions.js";
import { start, finish, Node } from "./a-star_functions.js";

// Непосредственно алгоритм поиска
export async function aStar() {

    disableButtons();

    // эвристика для алгоритма (Манхэттен)
    function heuristic(v, end) {
        return Math.abs(v.x - end.x) + Math.abs(v.y - end.y);
    }

    // сравнение двух клеток
    function compare(a, b) {
        if (a.sumDistances < b.sumDistances)
            return -1;
        if (a.sumDistances > b.sumDistances)
            return 1;
        else
            return 0;
    }

    let size = document.getElementById('tableSize').value;

    // Счетчик для скипа задержек в анимации
    let count = 0;

    // Дефолтное значение старта и финиша.
    if(start.x == null || start.y == null){
        start.x = 0;
        start.y = 0;
        table.rows[0].cells[0].dataset.mode = 'start';
    }
    if(finish.x == null || finish.y == null){
        finish.x = size - 1;
        finish.y = size - 1;
        table.rows[size - 1].cells[size - 1].dataset.mode = 'finish';
    }

    clearPath();

    let stNode = new Node();
    stNode.x = Number(start.x);
    stNode.y = Number(start.y);

     // список точек, подлежащих проверке
    let openList = new Array;
    openList.push(stNode)

     // список уже проверенных точек
    let usedList = new Array;

    let current = new Node();

    // Пока есть клетки подлежащие проверке искать путь до финиша
    while (openList.length > 0) {
        openList.sort(compare);

        // Обновляем текущую ячейку (берем с наименьшим показателем sumDistances) и усыпляем для отрисовки пути
        current = openList[0];
        openList.splice(openList.indexOf(current), 1);
        usedList.push(current);
        if(count >= Math.floor(size / 10)){
            await sleep(101 - Number(document.getElementById('animationSpeed').value));
            count = 0;
        }
        count++;
        if (!(current.x == start.x && current.y == start.y) && !(current.x == finish.x && current.y == finish.y)) {
            document.getElementById("table").rows[current.y].cells[current.x].dataset.mode = "checked";
        }


        // Нашли финиш - брейк 🤙🏻
        if (current.x == finish.x && current.y == finish.y) {
            break;
        }

        //  Прочекать соседей текущей ячейки
        let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        for (let dir = 0; dir < directions.length; dir++) {
            var newNeighbour = new Node();
            newNeighbour.x = current.x + directions[dir][0];
            newNeighbour.y = current.y + directions[dir][1];

            // Проверка соседа на нахождение в массивах
            let isUsed = usedList.find(node => (node.x == newNeighbour.x && node.y == newNeighbour.y));
            let neighbour = openList.find(node => (node.x == newNeighbour.x && node.y == newNeighbour.y));

            // Если ячейка не использована и не находится в openList просчитать дистанции
            if (isInside(newNeighbour.x, newNeighbour.y, size) && map[newNeighbour.y][newNeighbour.x] === 0 && isUsed == null) {
                if (neighbour == null) {

                    if(!(newNeighbour.x == finish.x && newNeighbour.y == finish.y))
                        table.rows[newNeighbour.y].cells[newNeighbour.x].dataset.mode = 'checking';

                    newNeighbour.distanceToStart = current.distanceToStart + 1;
                    newNeighbour.distanceToFinish = heuristic(newNeighbour, finish);
                    newNeighbour.sumDistances = newNeighbour.distanceToStart + newNeighbour.distanceToFinish;

                    newNeighbour.parent = current;
                    openList.push(newNeighbour);
                    // Если ячейка находится в openList поменять дистанцию до старта если надо
                } else {
                    if (neighbour.distanceToStart >= current.distanceToStart + 1) {
                        openList[openList.indexOf(neighbour)].distanceToStart = current.distanceToStart + 1;
                        openList[openList.indexOf(neighbour)].parent = current;
                    }
                }

            }
        }
    }

    // Не найден финиш - оповестить пользователя
    if (!(current.x == finish.x && current.y == finish.y)) {
        alert(`Не получается найти путь 😭`);
    // Найден - отрисовать путь
    } else {
        for(;current.parent != null; current = current.parent) {

            if(count >= Math.floor(size / 10)){
                await sleep(101 - Number(document.getElementById('animationSpeed').value));
                count = 0;
            }
            count++;

            if (!(current.x == finish.x && current.y == finish.y))
                document.getElementById("table").rows[current.y].cells[current.x].dataset.mode = "path"
        }
    }

    enableButtons()
}