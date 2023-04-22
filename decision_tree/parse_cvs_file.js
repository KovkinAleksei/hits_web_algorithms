import {divider} from "./tree_page.js";

export function readFile(text) {
    // Таблица с данными
    let data = [];

    let i = 0;
    let line = "";

    // Чтение всего файла
    while (i < text.length) {
        // Чтение строки файла
        while (text[i] != '\n') {
            line += text[i];
            i++;
        }

        // Сохранение строки файла
        if (divider === ",") {
            data.push(line.split(/,(?=[^\s])/));
        }
        else if (divider === ";") {
            data.push(line.split(/;(?=[^\s])/));
        }
        else {
            data.push(line.split(/\s(?=[^\s])/));
        }
        
        // Чтение следующей строки файла
        line = "";
        i++;
    }

    // Возврат таблицы
    return data;
}