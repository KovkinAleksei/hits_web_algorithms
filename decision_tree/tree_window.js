const list = document.getElementById("root");

// Маштабирование дерева
list.addEventListener('wheel', function(event) {
    event.preventDefault();

    const delta = Math.sign(event.deltaY);
    const zoomValue = parseFloat(window.getComputedStyle(list).zoom);

    if (zoomValue + delta > 0.1 && zoomValue + delta < 5) {
        list.style.zoom = zoomValue + delta * 0.1;
    }
});

const tree = document.getElementById("tree");
let isMovable = false;

// Позиция курсора
let pos = {
    top: 0,
    left: 0,
    x: 0,
    y: 0
};

// Движение дерева зажатием лкм
const mouseDownHandler = function(e) {
    isMovable = true;

    tree.style.cursor = 'grabbing';
    tree.style.userSelect = 'none';

    pos = {
        left: tree.scrollLeft,
        top: tree.scrollTop,
        x: e.clientX,
        y: e.clientY
    };
};

// Перетаскивание дерева
const mouseMoveHandler = function(e) {
    if (isMovable) 
    {
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        tree.scrollTop = pos.top - dy;
        tree.scrollLeft = pos.left - dx;
    }
};

// Прекращение перетаскивания дерева отжатием лкм
const mouseUpHandler = function(e) {
    isMovable = false;

    tree.style.cursor = 'default';
    tree.style.removeProperty('user-select');
};

tree.addEventListener('mousedown', mouseDownHandler);
tree.addEventListener('mousemove', mouseMoveHandler);
document.addEventListener('mouseup', mouseUpHandler);