import { feedforward } from "./nn.js";

// Создание канваса
let canvas = document.getElementById("drawField");
let context = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let brushSize = document.getElementById("brushSize");
brushSize.addEventListener('change', function() { context.lineWidth = brushSize.value; })

context.lineWidth = brushSize.value;

// устанавливаем начальные координаты
let lastX;
let lastY;

let draw;

// обработчик нажатия мыши
canvas.addEventListener("mousedown", function(e) {
    lastX = e.clientX - canvas.offsetLeft;
    lastY = e.clientY - canvas.offsetTop;
    draw = true;
    context.beginPath();
    context.moveTo(lastX, lastY);
});

// обработчик движения мыши
canvas.addEventListener("mousemove", function(e) {
    if (e.buttons !== 1) {
        return;
    }
    if(draw === true) {

        let currentX = e.clientX - canvas.offsetLeft;
        let currentY = e.clientY - canvas.offsetTop;

        context.lineTo(currentX, currentY);
        context.strokeStyle = "black";
        context.stroke();

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

let cnv = document.getElementById('cnv');
let ctx = cnv.getContext("2d");

let imgWidth = canvas.width;
let imgHeight = canvas.height;
// Функция запускающая работу нн
function neuralNetwork() {
    let canvas = document.getElementById('drawField');
    let image = new Image();
    image.src = canvas.toDataURL();

    image.onload = () => {
        var imgData = context.getImageData(0, 0, imgWidth, imgHeight).data;
        console.log(imgData)
        let test = new Array(imgHeight * imgWidth); 
        for (let i = 3; i < imgData.length; i += 4) {
            test[ Math.floor(i / 4) ] = (imgData[i] / 255);
        }



        // get the corners of the content (not the spaces)
        let cropTop = scanY(true, test);
        let cropBottom = scanY(false, test);
        let cropLeft = scanX(true, test);
        let cropRight = scanX(false, test);

        let cropXDiff = cropRight - cropLeft;
        let cropYDiff = cropBottom - cropTop;
        console.log(cropTop +  " " + cropLeft + " " + cropBottom + " " + cropRight)
        // get the content that doesn't contain outer spaces

        cnv.width = 28;
        cnv.height = 28;

        let size = Math.floor(Math.max(cropXDiff, cropYDiff) * 0.3) * 2 + Math.max(cropXDiff, cropYDiff);
        let gorizontalPaddings = Math.floor((size - cropXDiff) / 2);
        let verticalPaddings = Math.floor((size - cropYDiff) / 2);

        ctx.drawImage(image, cropLeft - gorizontalPaddings, cropTop - verticalPaddings, cropXDiff + (gorizontalPaddings * 2), cropYDiff + (verticalPaddings * 2), 0, 0, 28, 28);
        let scaledImage = ctx.getImageData(0, 0, 28, 28).data;

        //let scaledImage = scaleImageData(image);
        let oneChannelImage = new Array(28 ** 2);

        for (let i = 3; i < scaledImage.length; i += 4) {
            oneChannelImage[ Math.floor(i / 4) ] = (scaledImage[i] / 255);
        }

        // let centredImage = imageCentring(oneChannelImage);
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

function scanX(fromLeft, imgData) {
    var offset = fromLeft? 1 : -1;

    // loop through each column
    for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

        // loop through each row
        for(var y = 0; y < imgHeight; y += 4) {
            let index = (y * imgHeight) + x;
            if (imgData[index] != 0) {
                if (fromLeft) {
                    return x;
                } else {
                    return Math.min(x + 1, imgWidth);
                }
            }      
        }
    }
    return null; // all image is white
};

function scanY(fromTop, imgData) {
    var offset = fromTop ? 1 : -1;

    // loop through each row
    for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

        // loop through each column
        for(var x = 0; x < imgWidth; x++) {
            let index = (y * imgHeight) + x;
            if (imgData[index] != 0) {
                if (fromTop) {
                    return y;
                } else {
                    return Math.min(y + 1, imgHeight);
                }
            }
        }
    }
    return null; // all image is white
 }

 // Очистить канвас
function clearCanvas() {
    context.clearRect(0,0, canvas.width, canvas.height);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    document.getElementById("answerLabel").textContent = "";
}

let clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', function() { clearCanvas(); });