import { feedforward } from "./nn.js";

let canvas = document.getElementById("drawField");
let ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

ctx.lineWidth = 8;

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
    if(draw == true) {

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

function clearCanvas() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    document.getElementById("answerLabel").textContent = "Ответ: ";
}

function neuralNetwork() {
    let canvas = document.getElementById('drawField');
    let image = new Image();
    image.src = canvas.toDataURL();

    
    image.onload = () => {
        let scaled = scaleImageData(image);
        let test = new Array(28 ** 2)
        for (let i = 3; i < scaled.data.length; i += 4) {
            test[ Math.floor(i / 4) ] = [ (scaled.data[i] / 255) ];
        }
        let res = feedforward(test);
        let max = 0.0, maxInd = 0;
        for (let i = 0; i < res.length; i++) {
            if (res[i][0] >= max) {
                max = res[i][0];
                maxInd = i;
            }
        }
        document.getElementById('answerLabel').textContent = "Ответ: " + maxInd;
    }
}

function scaleImageData(image) {
    // Dynamically create a canvas element
    let canvas = document.createElement("canvas");

    // var canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = 28;
    canvas.height = 28;

    // Actual resizing
    ctx.drawImage(image, 0, 0, 28, 28);
    
    return ctx.getImageData(0, 0, 28, 28);
}

let clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', function() { clearCanvas(); });

let startButton = document.getElementById('startNetwork');
startButton.addEventListener('click', function() { neuralNetwork(); })