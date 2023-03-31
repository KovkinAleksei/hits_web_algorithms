let canvas = document.getElementById("drawField");
let ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

ctx.lineWidth = 10;

// устанавливаем начальные координаты
let lastX;
let lastY;

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
});

function clearCanvas() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    document.getElementById("answerLabel").textContent = "Ответ: ";
}
let count = 0;
function neuralNetwork() {
    document.getElementById('answerLabel').textContent = 'Ответ: ' + count;
    count++;
}

let clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', function() { clearCanvas(); });

let startButton = document.getElementById('startNetwork');
startButton.addEventListener('click', function() { neuralNetwork(); })