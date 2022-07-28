const canvas = document.getElementById("game__container");
const ctx = canvas.getContext('2d');

class SnakePart{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
}


let speed = 7;                  // higher = faster
let tileCount = 20;             // 20 tiles across, 20 down
let tileSize = canvas.width / tileCount - 2;
let headX = 10;
let headY = 10;                 // this makes it middle of the screen
const snakeParts = [];
let tailLength = 2;             // this starts the snake with 2 tails

let appleX = 5;
let appleY = 5;

//movement variables where we 
let xVelocity = 0;
let yVelocity = 0;

const start = document.getElementById('start');
start.addEventListener('click', drawGame());

function drawGame() {
  clearScreen();
  changeSnakePosition();
  drawSnake();
  drawApple();
  checkAppleCollision();
  setTimeout(drawGame, 1000/ speed);
}

function clearScreen() {
ctx.fillStyle = 'black';
ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawSnake () {
  ctx.fillStyle = 'orange'
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
  
  ctx.fillStyle = 'green'
  for(let i=0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  
  }

  snakeParts.push(new SnakePart(headX, headY));     // creates the new snake tail block next to the head
  if(snakeParts.length > tailLength){
    snakeParts.shift();                             // removes the furthest item from the snake parts if we have more than our tail size
  }
}


function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = 'red';
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

// this is our collision function, it respawns the apple elsewhere via math.random
function checkAppleCollision() {
  if(appleX === headX && appleY == headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;   //add +1 value to tailLength
  }
} 


// add event listener for keydown

window.addEventListener('keydown', keyDown);

function keyDown(e) {
    if (e.keyCode == 38){ // 38 = up, google keycodes
      if (yVelocity == 1)  // because in down movements, yvelocity is 1 and x is 0, this prevents snake from going back up into its own body
        return;
      yVelocity = -1;
      xVelocity = 0;
    }
  
    if (e.keyCode == 40) { // 40 = down
      yVelocity = 1;
      xVelocity = 0;
    }
  
    if (e.keyCode == 37) { // 37 = left
      yVelocity = 0;
      xVelocity = -1;
    }
  
    if (e.keyCode == 39) { // 39 = right
      yVelocity = 0;
      xVelocity = 1;
    }
  }