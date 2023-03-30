import { createPrimmLabyrinth, createTable } from './maze.js';
import { aStar, setStartFinish } from './a-star.js';

let primmButton = document.getElementById('primmButton');
primmButton.addEventListener('click', function() { createPrimmLabyrinth(); });

let aStarButton = document.getElementById('aStar');
aStarButton.addEventListener('click', function() { aStar(); })

let changeSize = document.getElementById('tableSize');
changeSize.addEventListener('change', function() { createTable(); })

let settargets = document.getElementById('setStartFinish');
settargets.addEventListener('click', function() { setStartFinish(); })