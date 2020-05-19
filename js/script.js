// CONSTANTS
const colorSnake = '#aaa';
const colorFood = '#c80';
const colorFlash = '#fff';
const up = 0;
const down = 1;
const left = 2;
const right = 3;
const keyUp = 87;
const keyDown = 83;
const keyLeft = 65;
const keyRight = 68;
const cellSize = 22;
const gridW = 22;
const gridH = 22;

// VARIABLE GLOBAL INITIALIZATIONS
let canvas;
let context;
let timer;
let snake;
let food;
let direction;
let moving;
let flashing;

//keydown tracker
function keyDepressed(e) {
    let key = e.keyCode || e.which;
    let lastMoving;
    if (direction.length >=2)
        return;
    if (direction.length > 0)
        lastMoving = direction[direction.length - 1];
    else
        lastMoving = moving;
    switch (key) {
        case keyUp:
            if (lastMoving !== down) {
                direction.push(up);
            }
            break;
        case keyDown:
            if (lastMoving !== up) {
                direction.push(down);
            }
            break;
        case keyLeft:
            if (lastMoving !== right) {
                direction.push(left);
            }
            break;
        case keyRight:
            if (lastMoving !== left) {
                direction.push(right);
            }
            break;
    }
}

window.addEventListener('keydown', keyDepressed);

function drawCells(cells, color) {
    context.fillStyle = color;
    cells.forEach(function(cell) {
        let cellX = cell[0] * cellSize;
        let cellY = cell[1] * cellSize;
        context.fillRect(cellX, cellY, cellSize, cellSize);
    })
}

function drawGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let snakeColor = (flashing) ? colorFlash : colorSnake;
    drawCells(snake, snakeColor);
    drawCells(food, colorFood);
}

function getRandomNum(a, b) {
    return Math.floor(Math.random() * b + a);
}

function checkCells(x, y, cells) {
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        if (cell[0] === x & cell[1] === y)
            return i;
    }
    return -1;
}

function makeFood() {
    // attempts to add food, aborts if coord contain snake
    if (food.length >= 3)
        return;
    let x = getRandomNum(0, gridW - 1);
    let y = getRandomNum(0, gridH - 1);
    //check every cell of snake for these coord abort if necessary
    if (checkCells(x, y, snake) >= 0)
        return;
    //check every food cell, make sure food doesn't spawn on self
    if (checkCells(x, y, food) >= 0)
        return;
    // if at this step, add food
    food.push([x,y]);
}

function updateGame() {
    let head = snake[snake.length - 1];
    let next = [head[0], head[1]];
    if (direction.length > 0) {
        moving = direction.shift();
    }
    switch (moving) {
        case up:
            //move snake along y axis up
            next [1]--;
            if (next[1] <0)
                next[1] = gridH - 1;
            break;
        case down:
            //move snake along y axis down
            next[1]++;
            if (next[1] > gridH - 1)
                next[1] = 0;
            break;
        case left:
            //move snake along x axis left
            next[0]--;
            if (next[0] < 0)
                next[0] = gridW - 1;
            break;
        case right:
            //move snake along x axis right
            next[0]++;
            if (next[0] > gridW - 1)
                next [0] = 0;
            break;
    }
    //check for self-collision
    if (checkCells(next[0], next[1], snake) >= 0) {
        endGame();
        return;
    }
    snake.push(next);
    let ate = checkCells(next[0], next[1], food);
    if (ate >= 0)
        food.splice(ate, 1);
    if (ate === -1)
        snake.shift();
    if (getRandomNum(0, 12) === 0)
        makeFood();
}

function endGame() {
    clearInterval(timer);
    let flashInterval;
    let count = 0;
    flashing = true;
    flashInterval = setInterval(function() {
        flashing = !flashing;
        drawGame();
        count++;
        if (count > 5) {
            clearInterval(flashInterval);
            resetGame();
            startGame();
        }
    }, 400);
}

function resetGame() {
    snake = [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1]];
    food = [];
    for (let i = 0; i < 3; i++)
        makeFood();
    moving = right;
    direction = [];
    flashing = false;
}

function startGame() {
    drawGame();
    //activate game timer
    timer = setInterval(function() {
        updateGame();
        drawGame();
    }, 200);
}

function initGame() {
    canvas = document.getElementById('snake');
    context = canvas.getContext('2d');
    resetGame();
    startGame();
}

window.addEventListener('load', initGame);