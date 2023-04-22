import { createWall, setDefaultStartFinish, disableButtons, enableButtons } from "./a-star_functions.js"

export let map = new Array();

// Создание таблицы
export function createTable(){

    // удалить таблицу
    var table = document.getElementById('table');
    if (table !== null)
        table.remove();

    // создать новую таблицу
    table = document.createElement("table"); 
    table.id = 'table';
    table.border = 1;

    // установить размер
    var row, cell;
    var size = document.getElementById('tableSize').value;
    let maxSize = document.getElementById('tableSize').max;
    if (size < 5) 
        size = 5;
    if(size % 2 !== 1)
        size++;
    size = Math.min(maxSize, size);
    document.getElementById("tableSize").value = size;
    map.length = 0;

    // Создание ячеек таблицы
    for (var column = 0; column < size; column++) { 
        let r = table.insertRow(column);
        map[column] = new Array();

        for (var row = 0; row < size; row++) {
            cell = r.insertCell(row);

            cell.dataset.mode = "empty"; // тип клетки
            cell.dataset.x = column;
            cell.dataset.y = row;

            map[column][row] = 0;
        }
    }

    // Создание ивента поставить/убрать стену + вставка таблицы + дефолтные старт и финиш
    table.addEventListener("click", createWall);
    document.getElementById("tableBlock").appendChild(table);
    setDefaultStartFinish();
}

createTable();