import { feedforward } from "./nn.js";

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
    document.getElementById("answerLabel").textContent = "";
}

function neuralNetwork() {
    let canvas = document.getElementById('drawField');
    let image = new Image();
    image.src = canvas.toDataURL();

    image.onload = () => {
        let scaledImage = scaleImageData(image);
        let oneChannelImage = new Array(28 ** 2)
        for (let i = 3; i < scaledImage.data.length; i += 4) {
            oneChannelImage[ Math.floor(i / 4) ] = (scaledImage.data[i] / 255);
        }
        let centredImage = imageCentring(oneChannelImage);

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

function imageCentring(image){
    let up = 28;
    let down = 0;
    let right = 0;
    let left = 28;
    for(let i = 0; i < 28; i++) {
        for(let j = 0; j < 28; j++) {
            let index = (28 * i) + j;
            if(image[index] > 0){
                
                if(up > i) {
                    up = i;
                }
                if(left > j){
                    left = j;
                }
                if(right < j){
                    right = j;
                }
                if(down < i){
                    down = i;
                }
            }
        }
    }
    
    let vert = (down - up);
    let goriz = (right - left);

    let helpImage = new Array(goriz);
for(let i = 0; i < goriz; i++) {
    helpImage[i] = new Array(vert);
}

    let ind = 0, jind = 0;
    for(let i = 0; i < 28; i++) {
        for(let j = 0; j < 28; j++) {
            if(i >= up && i < down && j >= left && j < right) {
                let index = (28 * i) + j;
                // console.log(index)
                // console.log('ind jind ' + ind + " " + jind)
                helpImage[ind][jind] = image[index];
                jind++;
                if(jind >= vert){
                    ind++;
                    jind = 0;
                }
            }
        }
    }

    let size = Math.floor(Math.max(vert, goriz) * 0.3) * 2 + Math.max(vert, goriz);
    let newImage = new Array(size);
    for(let i = 0; i < size; i++) {
        newImage[i] = new Array(size).fill(0);
    }
    
    ind = 0; jind = 0;
    for(let i = 0; i < 28; i++) {
        for(let j = 0; j < 28; j++) {
            if(i >= up && i < down && j >= left && j < right) {
                let index = (28 * i) + j;
                // console.log(index)
                // console.log('ind jind ' + ind + " " + jind)
                newImage[ind][jind] = image[index];
                jind++;
                if(jind >= vert){
                    ind++;
                    jind = 0;
                }
            }
        }
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