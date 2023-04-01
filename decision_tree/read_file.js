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
        data.push(line.split(';'));

        // Чтение следующей строки файла
        line = "";
        i++;
    }

    // Возврат таблицы
    return data;
}