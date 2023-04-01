import { readFile } from "./read_file.js";

let file = document.getElementById("fileInput");
let makeTreeButton = document.getElementById("makeTree");

makeTreeButton.addEventListener('click', (e) => {
    let data = [];

    if (file.value === ''){
        alert('Файл не загружен');
    }
    else {
        // Открытие файла
        let data = file.files[0];
        let reader = new FileReader();

        // Чтение файла
        reader.readAsText(data);
        console.log(data);

        reader.onload = function () {
            data = readFile(reader.result);
            alert(data);
        }
    }
});