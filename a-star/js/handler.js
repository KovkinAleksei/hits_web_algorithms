import { createPrimmLabyrinth } from './maze.js';
import { aStar } from './a-star.js';
import { createTable } from './table.js';
import { setStartFinish } from './a-star_functions.js';

let primmButton = document.getElementById('primmButton');
primmButton.addEventListener('click', function() { createPrimmLabyrinth(); });

let aStarButton = document.getElementById('aStar');
aStarButton.addEventListener('click', function() { aStar(); })

let changeSize = document.getElementById('tableSize');
changeSize.addEventListener('change', function() { createTable(); })

let settargets = document.getElementById('setStartFinish');
settargets.addEventListener('click', function() { setStartFinish(); })

let animationSpeed = document.getElementById("animationSpeed");
animationSpeed.addEventListener('input', (e) => {
    animationSpeed.style.backgroundSize = (e.target.value - e.target.min) * 100 / (e.target.max - e.target.min) + '% 100%';

    document.getElementById('showAnimationSpeed').innerHTML = 'Скорость анимации поиска: ' + animationSpeed.value;
});