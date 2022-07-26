const canvas = document.getElementById("game__container");
const ctx = canvas.getContext('2d');


let speed = 7;                  // higher = faster
let tileCount = 20;             // 20 tiles across
let tileSize = canvas.width / tileCount - 2;
let objectSize = tileSize * 2;

const mushroom = [];
let tailLength = 2;             // this starts the snake with 2 tails
let score = 0; 


/**
 * Location variables
 */
 let headX = 10;
 let headY = 17;                 // starts snake in middle of screen
 
 let appleX = 5;
 let appleY = 5;                 // food - adds to tail size
 
 let mushX = 15;
 let mushY = 15;                 // bad food - removes tail
 
 
 //movement variables 
 let inputsXVelocity = 0;
 let inputsYVelocity = 0;
 
 let xVelocity = 0;
 let yVelocity = 0;

 let wPressed = false;
 let aPressed = false;
 let sPressed = false;
 let dPressed = false;

 let gravity = 0.4;
 
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
        super(9, 19, tileSize, tileSize);
        this.snakeParts = [];
        this.snakeParts.push(new SnakePart(this.x, this.y + this.snakeParts.length + 1));
        this.snakeParts.push(new SnakePart(this.x, this.y + this.snakeParts.length + 1));
        this.snakeParts.push(new SnakePart(this.x, this.y + this.snakeParts.length + 1));


    }

    draw(){
        
        this.snakeParts.forEach((snakePart)=>{
            let part = snakePart;
            ctx.fillStyle = 'green'
            ctx.fillRect(part.x * tileCount, part.y * tileCount, objectSize, objectSize);
            
        });
        // for(let i=0; i < snakeParts.length; i++) {
        //     
        // }
        ctx.fillStyle = 'orange'
        ctx.fillRect(this.x * tileCount, this.y * tileCount, objectSize, objectSize);
        
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

class Mushrooms extends Entity{
  constructor(x,y){
      super(x,y, tileSize, tileSize);    // pass tilesize to constructor

      // this.color = 'white';
      let rand = Math.floor(Math.random() * (1 + -5 - -1)) + 1;
      this.negNum = rand;

  }

  draw() {
      this.gravity();
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x * tileCount, this.y * tileCount, tileSize * 2, tileSize * 2);
      ctx.fillStyle = 'black';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(this.negNum, (this.x * tileCount) + 12, (this.y * tileCount) + 25);
  }

}


  //player 2 mushroom on click event
class Apples extends Entity{
    constructor(x,y){
        super(x,y, tileSize, tileSize);    // pass tilesize to constructor

        // this.color = 'white';
        let rand = Math.round(Math.random() * 1) * -2;
        this.negNum = rand;

    }

    draw() {
        this.gravity();
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x * tileCount, this.y * tileCount, tileSize, tileSize);
        ctx.fillStyle = 'black';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(this.negNum, (this.x * tileCount) + 10, (this.y * tileCount) + 10);
    }

}


const snake = new Snake();


const testMush = new Mushrooms(1,1);
const test2 = new Entity(1,14,tileSize,tileSize);
console.log(testMush.detectHit(test2));

// Player 1 - snake
// Player 2 - create apples


/** --------------------------
 * Event Listeners
 * 
 ----------------------------- */

const start = document.getElementById('start');
start.addEventListener('click', drawGame);
// start.addEventListener('click', drawBoard);

const reset = document.getElementById('reset');
reset.addEventListener('click', clearScreen);


/** --------------------------
 * Core Functions
 * 
 ----------------------------- */

function drawGame() {

    function draw(){
        // xVelocity = inputsXVelocity;
        // yVelocity = inputsYVelocity;
        

        // clearScreen();
        changeSnakePosition();
        // drawBoard();
        // drawSnake();
        drawApple();
        drawWall();
        // Mushrooms.draw();
        // checkAppleCollision();
        testMush.draw();
        snake.draw();
        // drawTest();
        
        // setTimeout(drawGame, 1000/ speed);
    
        if (aPressed && snake.x > 0) {
            snake.x -= 1;
            snake.moveTail(-1);
        } else if (dPressed && snake.x < tileCount - 2) {
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



function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, objectSize, objectSize)
}

function drawTest() {
  ctx.strokeStyle = 'green';
  ctx.strokeRect(0 * tileCount, 0 * tileCount, objectSize, objectSize)
//   ctx.fillStyle = 'blue';
//   ctx.fillRect(20  * tileCount, 20 * tileCount, objectSize, objectSize);

}

/** -----------------------
 * Collision mechanism
 * 
 * ------------------------ */


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

        // is a is right of b
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


/** ------------------------------
 * Draw Interval 
 * 
 * ---------------------------- */
//  function animate() {
//     window.requestAnimationFrame(animate)
//     console.log('this works')
// }

setInterval(drawGame, 500);

/** ---------------------
 * Future use
 * ---------------------- */

function drawWall() {
    lineX = Math.floor(Math.random() * tileSize);
    lineY = Math.floor(Math.random() * tileSize);
    tSize = 20;

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(45, 65);
    ctx.lineTo(45, 120);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

// function drawBoard() {
//     // draw height
    
//     for (var x = 0; x <= 400; x += 20) {
//         ctx.moveTo(0 + x + 20, 20);
//         ctx.lineTo(0 + x + 20, 400 + 20);
//     }

//     for (var y = 0; y <= 400; y += 20) {
//         ctx.moveTo(20, y + 20);
//         ctx.lineTo(400 + 20,y + 20);
//     }

//     // draw width
//     // for (var y = 0; y <= 400; y+=20) {
//     //     ctx.moveTo(y, 0.5 + y + width);
//     //     ctx.lineTo(400 + height, 0.5 + y + width);
//     // }

//     ctx.strokeStyle = 'white';
//     ctx.stroke();
// }

// create classes for our snake 
// create walls
// snake left and right
// obstacles falling down
// collision detection

/** ---------------------
 * Old code
 * 
 ------------------------ */

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


// Old keypress mechanism


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
