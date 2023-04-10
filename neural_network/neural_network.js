import { feedforward } from "./nn.js";

// Создание канваса
let canvas = document.getElementById("drawField");
let ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

ctx.lineWidth = 20;

// устанавливаем начальные координаты
let lastX;
let lastY;

let draw;

// обработчик нажатия мыши
canvas.addEventListener("mousedown", function(e) {
    lastX = e.clientX - canvas.offsetLeft;
    lastY = e.clientY - canvas.offsetTop;
    draw = true;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
});

// обработчик движения мыши
canvas.addEventListener("mousemove", function(e) {
    if (e.buttons !== 1) {
        return;
    }
    if(draw === true) {

        let currentX = e.clientX - canvas.offsetLeft;
        let currentY = e.clientY - canvas.offsetTop;

        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = "black";
        ctx.stroke();

        lastX = currentX;
        lastY = currentY;
    }
});

// обработчик отпускания кнопки мыши
canvas.addEventListener("mouseup", function(e) {
    lastX = null;
    lastY = null;
    neuralNetwork();
});

// Очистить канвас
function clearCanvas() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    document.getElementById("answerLabel").textContent = "";
}

// Функция запускающая работу нн
function neuralNetwork() {
    let canvas = document.getElementById('drawField');
    let image = new Image();
    image.src = canvas.toDataURL();

    image.onload = () => {
        let scaledImage = scaleImageData(image);
        let oneChannelImage = new Array(28 ** 2);

        for (let i = 3; i < scaledImage.data.length; i += 4) {
            oneChannelImage[ Math.floor(i / 4) ] = (scaledImage.data[i] / 255);
        }

        let centredImage = imageCentring(oneChannelImage);
        // console.log('centr ' + centredImage)
        let resultImage = feedforward(oneChannelImage);
        let max = -1, maxInd = 0;
        for (let i = 0; i < resultImage.length; i++) {
            if (resultImage[i] >= max) {
                max = resultImage[i];
                maxInd = i;
            }
        }
        document.getElementById('answerLabel').textContent = "" + maxInd;
    }
}

// function imageCentring(image){
//     let up = 28;
//     let down = 0;
//     let right = 0;
//     let left = 28;
//     for(let i = 0; i < 28; i++) {
//         for(let j = 0; j < 28; j++) {
//             let index = (28 * i) + j;
//             if(image[index] > 0){
                
//                 if(up > i) {
//                     up = i;
//                 }
//                 if(left > j){
//                     left = j;
//                 }
//                 if(right < j){
//                     right = j;
//                 }
//                 if(down < i){
//                     down = i;
//                 }
//             }
//         }
//     }
    
//     let vert = (down - up);
//     let goriz = (right - left);

//     let helpImage = new Array(goriz);
// for(let i = 0; i < goriz; i++) {
//     helpImage[i] = new Array(vert);
// }

//     let ind = 0, jind = 0;
//     for(let i = 0; i < 28; i++) {
//         for(let j = 0; j < 28; j++) {
//             if(i >= up && i < down && j >= left && j < right) {
//                 let index = (28 * i) + j;
//                 // console.log(index)
//                 // console.log('ind jind ' + ind + " " + jind)
//                 helpImage[ind][jind] = image[index];
//                 jind++;
//                 if(jind >= vert){
//                     ind++;
//                     jind = 0;
//                 }
//             }
//         }
//     }

//     let size = Math.floor(Math.max(vert, goriz) * 0.3) * 2 + Math.max(vert, goriz);
//     let newImage = new Array(size);
//     for(let i = 0; i < size; i++) {
//         newImage[i] = new Array(size).fill(0);
//     }
    
//     let gorizontalPaddings = Math.floor((size - goriz) / 2);
//     let verticalPaddings = Math.floor((size - vert) / 2);
//     ind = 0; jind = 0;
//     for(let i = 0; i < size; i++) {
//         for(let j = 0; j < size; j++) {
//             if(i > verticalPaddings && i < size - verticalPaddings && j > gorizontalPaddings && j < size - gorizontalPaddings){
//                 // console.log(ind + " " + jind)
//                 newImage[i][j] = helpImage[ind][jind];
//                 jind++;
//                 if(jind >= vert){
//                     ind++;
//                     jind = 0;
//                 }
//             }
//         }
//     }
//     // console.log(newImage)
//     const cnvas = document.createElement('canvas');
//     cnvas.width = size;
//     cnvas.height = size;
//     const cotx = cnvas.getContext('2d');
//     const imageData = cotx.createImageData(cnvas.width, cnvas.height);
//     for (let y = 0; y < cnvas.height; y++) {
//       for (let x = 0; x < cnvas.width; x++) {
//         const i = (y * cnvas.width + x) * 4;
//         imageData.data[i] = 0;
//         imageData.data[i + 1] = 0;
//         imageData.data[i + 2] = 0;
//         imageData.data[i + 3] = newImage[y][x] * 255; // установка непрозрачности
//       }
//     }
//     console.log(imageData)
//     cotx.putImageData(imageData, 0, 0);
    
//     let resImage = new Image();
//     resImage.src = cnvas.toDataURL();

//     let scaledImage = scaleImageData(resImage);
//     console.log(scaledImage)
//     let oneChannelImage = new Array(28 ** 2);

//     for (let i = 3; i < scaledImage.data.length; i += 4) {
//         oneChannelImage[ Math.floor(i / 4) ] = (scaledImage.data[i] / 255);
//     }
//     // console.log(oneChannelImage);
//     return oneChannelImage;
// }

function scaleImageData(image) {

    let canvas = document.createElement("canvas");

    let ctx = canvas.getContext("2d");

    canvas.width = 28;
    canvas.height = 28;

    ctx.drawImage(image, 0, 0, 28, 28);    
    return ctx.getImageData(0, 0, 28, 28);
}

let clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', function() { clearCanvas(); });