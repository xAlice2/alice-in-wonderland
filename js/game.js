const canvas = document.getElementById("game__container");
const ctx = canvas.getContext('2d');


let speed = 7;                  // higher = faster
let tileCount = 20;             // 20 tiles across, 20 down
let tileSize = canvas.width / tileCount - 4;

const mushroom = [];
let tailLength = 2;             // this starts the snake with 2 tails
let score = 0; 


/**
 * Location variables
 */
 let headX = 10;
 let headY = 10;                 // starts snake in middle of screen
 
 let appleX = 5;
 let appleY = 5;                 // food
 
 let mushX = 15;
 let mushY = 15;                 // bad food
 
 
 //movement variables 
 let inputsXVelocity = 0;
 let inputsYVelocity = 0;
 
 let xVelocity = 0;
 let yVelocity = 0;

 let wPressed = false;
 let aPressed = false;
 let sPressed = false;
 let dPressed = false;

 let gravity = 10;
 
/**
 * Number generation variables
 */

//random number generator between 1-3 for apples.
const randNum = Math.floor(Math.random() * 3) + 1;
// console.log(randNum)

// to store randomly generated negative number
let negNum;
// console.log(negNum);



// add sound files here
// const nameOfSound = new Audio("file directory");


class SnakePart{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
}
class Entity{
    constructor(x,y,height,width){
      this.x = x;
      this.y = y;
      this.height = height;
      this.width = width;
    }
    detectHit(entity){  // passes through an entity
        return overlap(this, entity); // passes through the overlap function to return true/false
    }
    gravity(){
        this.y += gravity;
    }
    
  }

// player 1 - snake 
class Snake extends Entity{

    constructor(){
        super(19, 10, tileSize, tileSize);
        this.snakeParts = [];
        this.snakeParts.push(new SnakePart(this.x, this.y + this.snakeParts.length + 1));
        this.snakeParts.push(new SnakePart(this.x, this.y + this.snakeParts.length + 1));
        this.snakeParts.push(new SnakePart(this.x, this.y + this.snakeParts.length + 1));


    }

    draw(){
        ctx.fillStyle = 'green'
        this.snakeParts.forEach((snakePart)=>{
            let part = snakePart;
            ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
            
        });
        // for(let i=0; i < snakeParts.length; i++) {
        //     
        // }
        ctx.fillStyle = 'orange'
        ctx.fillRect(this.x * tileCount, this.y * tileCount, tileSize, tileSize);
        
    }


    grow(){
        snakeParts.push(new SnakePart(headX, headY));       // creates the new snake tail block next to the head
        if(snakeParts.length > tailLength){
            snakeParts.shift();                             // removes the furthest item from the snake parts if we have more than our tail size
        }
    }

    moveTail(changeX){
        this.snakeParts.forEach((snakePart)=>{
            snakePart.x += changeX;
        })
    }
}



  //player 2 mushroom on click event
class Mushrooms extends Entity{
    constructor(x,y){
        super(x,y, tileSize, tileSize);    // pass tilesize to constructor

        // this.color = 'white';
        let rand = Math.floor(Math.random() * 4) * -1;
        this.negNum = rand;

    }

    draw() {
        this.gravity();
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x * tileCount, this.y * tileCount, tileSize, tileSize);
        ctx.fillStyle = 'black';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(this.negNum, (this.x * tileCount) + 4, (this.y * tileCount) + 10);
    }

}


const snake = new Snake();


const test = new Mushrooms(1,14);
const test2 = new Entity(1,14,tileSize,tileSize);
console.log(test.detectHit(test2));

// Player 1 - snake
// Player 2 - create apples








/** --------------------------
 * Event Listeners
 * 
 ----------------------------- */

const start = document.getElementById('start');
start.addEventListener('click', drawGame);

const reset = document.getElementById('reset');
reset.addEventListener('click', clearScreen);


/** --------------------------
 * Core Functions
 * 
 ----------------------------- */

function drawGame() {

    function draw(){
        xVelocity = inputsXVelocity;
        yVelocity = inputsYVelocity;
        clearScreen();
        changeSnakePosition();
        // drawSnake();
        drawApple();
        drawWall();
        // Mushrooms.draw();
        // checkAppleCollision();
        test.draw();
        snake.draw();
        // setTimeout(drawGame, 1000/ speed);
    
        if (aPressed && snake.x > 0) {
            snake.x -= 1;
            snake.moveTail(-1);
        } else if (dPressed && snake.x < tileCount -1) {
            snake.x += 1;
            snake.moveTail(1);
        }
    
    }
    requestAnimationFrame(draw);
}



function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}



// 
function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}



/** -----------------------
 * Collision mechanism
 * 
 * ------------------------ */

// this is our collision function, it respawns the apple elsewhere via math.random
// to be added: twist - adds a random amount to tail length between 1-3 blocks
// function checkAppleCollision() {
//   if (appleX === headX && appleY == headY) {
//     appleX = Math.floor(Math.random() * tileCount);
//     appleY = Math.floor(Math.random() * tileCount);
//     tailLength++;   //add +1 value to tailLength
//     score++;
//     // nameOfSound.play();
//   }
// } 

// function checkMushroomCollision() {
//     if (mushX === headX && mushY == headY) {
//       mushX = Math.floor(Math.random() * tileCount);
//       mushY = Math.floor(Math.random() * tileCount);
//       tailLength -= negNum;   // takes away random amount of tail length
//       console.log(negNum);
//       // nameOfSound.play();
//     }
//   } 

/**
 * Helper function
 */

 function overlap(a, b) {
    if (a instanceof Entity &&
        b instanceof Entity) {
        const aTopLeft = {
            x: a.x,
            y: a.y
        };
        const aBottomRight = {
            x: a.x + a.width,
            y: a.y + a.height
        }
        const bTopLeft = {
            x: b.x,
            y: b.y
        }
        const bBottomRight = {
            x: b.x + b.width,
            y: b.y + b.height
        }

        // if a is left of b
        if (aBottomRight.x < bTopLeft.x) {
            return false;
        }

        // if a is above b
        if (aBottomRight.y < bTopLeft.y) {
            return false;
        }

        // if a is below b
        if (aTopLeft.y > bBottomRight.y) {
            return false;
        }

        // is a is right of be
        if (aTopLeft.x > bBottomRight.x) {
            return false;
        }

        return true;
    }
    return false;
}


/** ------------------------------
 * Key press mechanism
 * 
 * ---------------------------- */

// adding event listener for keydown

// document.body.addEventListener('keydown', keyDown);
// document.addEventListener('keyup', keyUpHandler, false);

// function keyDown(e) {
//     if (e.keyCode == 38 || e.keyCode == 87){    // 38 = up, 87 = w; google keycodes
//       if (yVelocity == 1)                       // because in down movements, yvelocity is 1 and x is 0, this prevents snake from going back up into its own body
//         return;
//       inputsYVelocity = -1;
//       inputsXVelocity = 0;
//     }
  
//     if (e.keyCode == 40 || e.keyCode == 83) { // 40 & 83 = down
//       inputsYVelocity = 1;
//       inputsXVelocity = 0;
//     }
  
//     if (e.keyCode == 37 || e.keyCode == 65) { // 37 & 65 = left
//       inputsYVelocity = 0;
//       inputsXVelocity = -1;
//     }
  
//     if (e.keyCode == 39 || e.keyCode == 68) { // 39 & 68 = right
//       inputsYVelocity = 0;
//       inputsXVelocity = 1;
//     }
//     console.log(e.keyCode);
//   }


document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


function keyDownHandler(event) {
    if(event.code === 'KeyA') {
        aPressed = true;
    // } else if (event.code === 'KeyS') {
    //     sPressed = true;
    } else if (event.code === 'KeyD') {
        dPressed = true;
    }
}

function keyUpHandler(event) {
    if(event.code === 'KeyA') {
        aPressed = false;
    } else if (event.code === 'KeyD') {
        dPressed = false;
    }
}

setInterval(drawGame, 50);

/** ---------------------
 * Future use
 * ---------------------- */

function drawWall() {
    lineX = Math.floor(Math.random() * tileSize);
    lineY = Math.floor(Math.random() * tileSize);

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(45, 65);
    ctx.lineTo(45, 120);
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

// create classes for our snake 
// create walls
// snake left and right
// obstacles falling down
// collision detection