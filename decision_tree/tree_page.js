import { readFile } from "./read_file.js";
import {main} from "./tree_algorithm.js";

let file = document.getElementById("fileInput");
let makeTreeButton = document.getElementById("makeTree");

makeTreeButton.addEventListener('click', (e) => {
    let fileInput = [];
    let data = [];

    if (file.value === ''){
        alert('Файл не загружен');
    }
    else {
        // Открытие файла
        fileInput = file.files[0];
        let reader = new FileReader();

        // Чтение файла
        reader.readAsText(fileInput);
        console.log(fileInput);

        reader.onload = function () {
            data = readFile(reader.result);
            //alert(data);

            main(data);
        }
    }
});