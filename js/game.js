const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 580;
canvas.height = 800;

const tSize = canvas.width / 5 - 15;
const playerTile = 50;
//row = 114.6s

const cw = canvas.width;
const ch = canvas.height;

let paused = false;
let animationID;

let gravity = 1.2;

let enemyY;
let enemyX;


var mouse = {
    x: window.innerWidth/2,
    y: window.innerHeight/2
}





// const amountofballs = 5;
// let particleArray = [];

// class SnakePart{
//     constructor(x,y){
//       this.x = x;
//       this.y = y;
//     }
//   }

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


/** ----------------------------------------------------------------------------
 * Player class -
 * 
 *          logic for Player One
 *  ----------------------------------------------------------------------------- */

class Player extends Entity{
    constructor(x, y, bulletController) {
        super(x, y, playerTile, playerTile);
        this.x = x;
        this.y = y;
        this.bulletController = bulletController;
        
        this.speed = 10;                    // how fast player 1 moves
        this.alive = true;                  // because starting with a game over doesn't make sense..
        this.health =  20;                  // player health
        this.radius = 25;                   // radius of the player
        this.diameter = this.radius - 22; 
        this.wall = 30;


        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
    }
    
    // what our player looks like
    draw(ctx) {
        this.move();
        this.wallCheck();

        ctx.lineWidth = 3;
        ctx.strokeStyle = "lightgreen";
        ctx.shadowColor = "green";  //98D7d1
        ctx.shadowBlur = 15; 
        ctx.fillStyle = "black";

        /** ============================================================
         * code for rectangle player shape
         * 
         
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 1;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.fillRect(this.x, this.y, this.width, this.height);
          
          ============================================================== */ 

        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 25, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        this.shoot();
        
        ctx.font = "20px Montserrat";
        ctx.fillStyle = "#fff";
        ctx.textAlign ="center"; 
        ctx.textBaseline = "middle";
        


        // ctx.strokeStyle = "#98D7D1";
        ctx.fillText(
            this.health, 
            this.x + this.width / 2, 
            this.y + this.height / 2
        )

        if (this.health <= 0){
          this.alive = false;
        }
    }
    


 /** ==================================================================
  * Bug: delay seems to push the tiles back 
  * 
  */

    shoot() {
        if (this.shootPressed) {
            console.log("pew");
            const speed = 5;
            const delay = 10;
            const damage = 1;
            const bulletX = this.x + this.width / 2;
            const bulletY = this.y;
            this.bulletController.shoot(bulletX, bulletY, speed, damage, delay);
        } else {
          console.log("not shooting")
        }
    }

    collideWith(entity) {
      if ((entity instanceof Enemy && 
        entity.health > 0) &&               // only collides if we have enough health
        this.detectHit(entity)){            // add or statement for divider 
        this.health--;
        entity.health = 0;
        enemies.splice(enemies.indexOf(entity), 1)
      }
    }

    // player movement
    move() {
        if (this.downPressed) {
          this.y += this.speed;
        }
        if (this.upPressed) {
          this.y -= this.speed;
        }
        if (this.leftPressed) {
          this.x -= this.speed;
        }
    
        if (this.rightPressed) {
          this.x += this.speed;
        }
      }  

      wallCheck(){
        if (this.y < this.diameter){        // up
            this.y = this.y;
        }
        if (this.y > ch - playerTile){      // down
            this.y = ch - playerTile;
        }
        if (this.x < this.diameter){        // left
            this.x = this.diameter;
        }
        if (this.x > cw - playerTile){      // right
            this.x = cw - playerTile;
        }
      }


      keydown = (e) => {
        if (e.code === "KeyW") {
          this.upPressed = true;
        }
        if (e.code === "KeyS") {
          this.downPressed = true;
        }
        if (e.code === "KeyA") {
          this.leftPressed = true;
        }
        if (e.code === "KeyD") {
          this.rightPressed = true;
        }
        // if (canvas.onmousedown) {
        //   this.shootPressed = true;
        // }
        // if (e.code === "Space") {  // rerouting feature to mouse click
        //   this.shootPressed = true;
        // }

      };
    
      keyup = (e) => {
        if (e.code === "KeyW") {
          this.upPressed = false;
        }
        if (e.code === "KeyS") {
          this.downPressed = false;
        }
        if (e.code === "KeyA") {
          this.leftPressed = false;
        }
        if (e.code === "KeyD") {
          this.rightPressed = false;
        }
        // if (canvas.onmouseup) {
        //   this.shootPressed = false;
        // }
        // if (e.code === "Space") {  // rerouting feature to mouseclick
        //   this.shootPressed = false;
        // }
      };



}







/** ----------------------------------------------------------------------------
 * Bullet Construction -
 * 
 *          targets for the pew pew
 *  ----------------------------------------------------------------------------- */



class BulletController{
    bullets = [];
    timerTillNextBullet = 0;

    constructor(canvas){
        this.canvas = canvas;
    }

    shoot(x, y, speed, damage, delay) {
        if (this.timerTillNextBullet <= 0) {
            if (this.bullets.length < 7) {  // limits the number of bullets to 7
                this.bullets.push(new Bullet(x, y, speed, damage));
            }
    
          this.timerTillNextBullet = delay;
        }
    
        this.timerTillNextBullet--;
      }
    


    draw(ctx) {
        this.bullets.forEach((bullet) => {
            if (this.isBulletOffScreen(bullet)) {
            const index = this.bullets.indexOf(bullet);
            this.bullets.splice(index, 1);  // remove bullet when offscreen
            }

            bullet.draw(ctx);
        });
    }

    removeBullet(bullet){
      this.bullets.splice(this.bullets.indexOf(bullet),1);
    }

    isBulletOffScreen(bullet) {
        return bullet.y <= -bullet.height;
    }

    collideWith(sprite){
        return this.bullets.some(bullet =>{
            if(bullet.collideWith(sprite)) {
                this.removeBullet(bullet);
              
                return true;
            }
            return false;
        })
    
    }

}
const currentColor = [];
class Bullet extends Entity{
    
    constructor(x, y, speed, damage){
      super(x, y, 15, 5);
        // this.x = x; 
        // this.y = y; 
        this.speed = speed;
        this.damage = damage;

        // this.width = 5;
        // this.height = 15;
        
        this.color = "yellow";
    }


    draw(ctx){
        ctx.fillStyle = this.color;
        this.y -= this.speed;           // negative because that is how it goes up
        // ctx.shadowColor = "#d53";
        // ctx.shadowBlur = 20; // how much shadow is blurred 
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
    }


    // collision detection
    collideWith(sprite) {
        if (
          // this.x < sprite.x + sprite.width &&
          // this.x + this.width > sprite.x &&
          // this.y < sprite.y + sprite.height &&
          // this.y + this.height > sprite.y
          this.detectHit(sprite)
        ) {
          sprite.takeDamage(this.damage);
          return true;
        }
        return false;
      }

}


let bulletController = new BulletController(canvas);

let player = new Player(
  canvas.width / 2.2, 
  canvas.height / 1.3,
  bulletController
);





/** -------------------------------------------------------------
 *   Player Two constructor (WIP)
 * 
 *       mouse click
 *       adds power-ups for player one to overcome level difficulty?

 * -------------------------------------------------------------- */

var mouseIsDown = false;
canvas.onmousedown = function(e) {

    player.shootPressed = true;
    // console.log('mouse is down');
}

canvas.onmouseup = function(e) {

    player.shootPressed = false;
    // console.log('mouse is up');
}



let mouseX;
let mouseY;



function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  mouseX = x;
  mouseY = y;
  console.log("x: " + x + " y: " + y)
}



 let colors = [
    {r: 44, g: 62, b: 80},
    {r: 231, g: 76, b: 60},
    {r: 236, g: 240, b: 241},
    {r: 52, g: 152, b: 219}
    ];

    class Particle{
        constructor(x, y, dx, dy, radius, colornumber) {
            this.x = mouseX;
            this.y = mouseY;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
            this.opacity = 1;
            this.colornumber = colornumber;


            this.draw = function() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, false, Math.PI*2);
                ctx.fillStyle = "rgba("+colors[this.colornumber].r+","+colors[this.colornumber].g+","+colors[this.colornumber].b+","+this.opacity+")";
                ctx.fill();
            }

            if (player.x >= 0) {
                this.update = function() {
                    for (var i = 0; i < particleArray.length; i++) {
                        if(particleArray[i].opacity < 0) {
                            particleArray.splice(i, 1);
                        }
                    }

                    this.opacity-= 0.01;
                    this.x+= this.dx;
                    this.y+= this.dy;

                    this.draw();
                }
            }
        }
    }

// ================================================================



/** ----------------------------------------------------------------------------
 * Tile constructor -
 * 
 *              For spawning tiles
 ----------------------------------------------------------------------------- */

 class Enemy extends Entity{
  constructor(x, y, health){
      super(x, y, tSize, tSize);
      this.x = x;
      this.y = y - 14;
      this.health = health;
      // this.collided = false;
      this.width = tSize;
      this.height = tSize;
  }

  draw(ctx){
      this.gravity();
      ctx.fillStyle = "black";                    // **FILL** color inside the tiles
      if(this.health === 1){
          ctx.strokeStyle = "#D8737F"             // darkgoldenrod (dark) D8737F
      }else if(this.health === 2){
          ctx.strokeStyle = "#FCBB6D"             // burlywood (med) 
      }else if(this.health === 3){
          ctx.strokeStyle = "blanchedalmond"             // blanchedalmond (light)
      }else{                         
          ctx.strokeStyle = "#fff";               // normal color
      }
      ctx.shadowColor = "red";                // GLOW F1E6C1
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.lineJoin = "bevel";         // beveled edges
      ctx.lineWidth = 4;              // how big the line width is
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeRect(this.x, this.y, this.width, this.height);

      // draw text
      ctx.fillStyle = "#fff";
      ctx.font = "bold 40px Arial"
      ctx.textAlign="center"; 
      ctx.textBaseline = "middle";
      ctx.fillText(
          this.health, 
          this.x + this.width / 2, 
          this.y + this.height / 1.95
      )

      enemyY = this.y;
      enemyX = this.x;
  }

  takeDamage(damage) {
      this.health -= damage;
  }

  isEnemyOffScreen(bullet) {
      return bullet.y <= -bullet.height;
  }
}

/** ================================================================
 * Future feature: DIVIDERS!
 * 
 *        -dividers are walls that spawn in the middle of a tile
 *        -does not damage player when collide
 *        -forces player to pick a lane to destroy tiles
 * 
 ===================================================================*/

 class Walls extends Entity{
  constructor(x, y){
      super(x, y, tSize, tSize);
      this.x = x;
      this.y = y;
      // this.collided = false;
      this.width = tSize;
      this.height = tSize;
  }

  draw(ctx){
      this.gravity();
      ctx.fillStyle = "black";                    // **FILL** color inside the tiles
      if(this.health === 1){
          ctx.strokeStyle = "#D8737F"             // darkgoldenrod (dark) D8737F
      }else if(this.health === 2){
          ctx.strokeStyle = "#FCBB6D"             // burlywood (med) 
      }else if(this.health === 3){
          ctx.strokeStyle = "blanchedalmond"             // blanchedalmond (light)
      }else{                         
          ctx.strokeStyle = "#fff";               // normal color
      }
      ctx.shadowColor = "red";                // GLOW F1E6C1
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.lineJoin = "bevel";         // beveled edges
      ctx.lineWidth = 4;              // how big the line width is
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeRect(this.x, this.y, this.width, this.height);

      // draw text
      ctx.fillStyle = "#fff";
      ctx.font = "bold 40px Arial"
      ctx.textAlign="center"; 
      ctx.textBaseline = "middle";
      ctx.fillText(
          this.health, 
          this.x + this.width / 2, 
          this.y + this.height / 1.95
      )

      enemyY = this.y;
      enemyX = this.x;
  }

  takeDamage(damage) {
      this.health -= damage;
  }

  isEnemyOffScreen(bullet) {
      return bullet.y <= -bullet.height;
  }
}







/** ----------------------------------------------------------------------------
 * Helper functions -
 * 
 *              Mostly randomization generators
 *
 ----------------------------------------------------------------------------- */

 function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
	
	// While there are elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	
	return array;
}

function randNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBoolean(){
    return Math.random() < 0.5;   // change to 1 to guarantee true (original value is 0.5)
}


/** ----------------------------------------------------------------------------
 * Collision detection -
 * 
 *                      
 *
 ----------------------------------------------------------------------------- */


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








/** ----------------------------------------------------------------------------
 * Tile Spawn Logic -
 * 
 *      purpose: to randomly spawn tiles at set coordinates
 *      level is 5 rows * level
 *      cw = 572;
 *      ch = 803;
 *
 ----------------------------------------------------------------------------- */



let dividerW = 5;           //divider width
let blockW = 100;           //block width

let currentLevel = 2;         // current level
let score = 0;
let blockHPGen = randNum((1 * currentLevel), (10 * currentLevel));  // enemy hp

var levelData = {
    number:5, 			//starting block number
    block_arr:[4,5,3,2,4,5], 	//how many blocks per line (maximum 5)
    divider_arr:[1,2,3,1,2], 	//how many divider per line (maximum 5)

    gap_arr:[4,3,4,3,2], 		//how many gap after each block

    moveSpeed:3, 			//screen move speed
    numberIncrease:1, 		//number increase
    moveSpeedIncrease:.5, 	//move speed increase
    gridNextLevel:2,

}; 		




 



 
// math: xy * 113 = 5 blocks per row
                                                  // we want a 5 x 7 grid
const tileWidth = (canvas.width / 5) - 2;         // this creates 5 tiles across the width of screen
const tileHeight = (canvas.height / 7) - 2;       // this creates 7 tiles down the length of the screen
const margin = 4;                                 // creates margins around the tiles

let enemies = [];

function createStage(){
  for(let i = 0; i < 1; i++){
    if (randomBoolean()){
      enemies.push(new Enemy(2, i * tileWidth, randNum(1, 8)));      // line 1, 5 blocks per row
      console.log(`createStage drew box 1`);
    } 
    if (randomBoolean()){
      enemies.push(new Enemy((1 * tileWidth) + margin, i * tileWidth, randNum(1, 8)));
      console.log(`createStage drew box 2`);
    } 
    if (randomBoolean()){
      enemies.push(new Enemy((2 * tileWidth) + margin, i * tileWidth, randNum(1, 8)));
      console.log(`createStage drew box 3`);
    } 
    if (randomBoolean()){
      enemies.push(new Enemy((3 * tileWidth) + margin, i * tileWidth, randNum(1, 8)));
      console.log(`createStage drew box 4`);
    } 
    if (randomBoolean()){
      enemies.push(new Enemy((4 * tileWidth) + margin, i * tileWidth, randNum(1, 8)));
      console.log(`createStage drew box 5`);
    }
  }
}


/** ----------------------------------------------------------------------------
 * Bug - 
 * 
 *          when asked to render tiles above canvas height, it only renders 2-5 every other row 
 *  ----------------------------------------------------------------------------- */



  function createNextStage(){
    for(let i = 0; i < 1; i++){
      if (randomBoolean()){
        enemies.push(new Enemy(4, (i * tSize) - tSize, randNum(1, 8)));      // line 1, 5 blocks per row
        console.log(`createNextStage2 drew box 1`);
      } else {

      }
      if (randomBoolean()){
        enemies.push(new Enemy((1 * tileWidth) + margin, (i * tSize) - tSize, randNum(1, 8)));
        console.log(`createNextStage2 drew box 2`);
      } 
      if (randomBoolean()){
        enemies.push(new Enemy((2 * tileWidth) + margin, (i * tSize) - tSize, randNum(1, 8)));
        console.log(`createNextStage2 drew box 3`);
      } 
      if (randomBoolean()){
        enemies.push(new Enemy((3 * tileWidth) + margin, (i * tSize) - tSize, randNum(1, 8)));
        console.log(`createNextStage2 drew box 4`);
      } 
      if (randomBoolean()){
        enemies.push(new Enemy((4 * tileWidth) + margin, (i * tSize) - tSize, randNum(1, 8)));
        console.log(`createNextStage2 drew box 5`);
      }
    }
    score += 10;
  }



/** ----------------------------------------------------------------------------
 * Game start pause reset music functions -
 * 
 *                to pause the anxiety buildup
 ----------------------------------------------------------------------------- */
 const start = document.getElementById('start');
 start.addEventListener('click', function(e) {
  start.disabled = true;
  resetClicked = false;
  
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  bulletController.draw(ctx);
  player.draw(ctx);

    gameLoop();

 });

 
 const reset = document.getElementById('reset');
 var resetClicked = false;

 reset.addEventListener('click', function() {
  // animationID = 0;
  // animationID = cancelAnimationFrame(gameLoop);
  resetClicked = true;
  // clearScreen();
 });


//  const pause = document.getElementById('pause');
//  pause.addEventListener('click', togglePause);

 const music = document.querySelector("music");


 function clearScreen() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  start.disabled = false;

  lastLevelUpdate = 1;
  bulletController = new BulletController(canvas);

  player = new Player(
    canvas.width / 2.2, 
    canvas.height / 1.3,
    bulletController
  );


  
  // player.alive = true;
  enemies = [];
  score = 0;
}


 function togglePause() {
     if (!paused)
     {
         paused = true;
         cancelAnimationFrame(gameLoop);
     } else if (paused)
     {
        paused = false;
        gameLoop();
     }
 
 }



window.addEventListener('keydown', function (e) {
    if (e.code === "Space") {
        togglePause();
    }
});






/** ----------------------------------------------------------------------------
 * Game Loops -
 * 
 *          runs like a hamster on a wheel
 ----------------------------------------------------------------------------- */

//  var amountofballs = 5;
//  var particleArray = [];

//  function init() {
//     for (var i = 0; i < amountofballs; i++) {
//         var radius = (Math.random()*5);
//         var x = mouse.x;
//         var y = mouse.y;
//         var dx = (Math.random()-0.5)*5;
//         var dy = (Math.random()-0.5)*5;
//         var colornumber = Math.floor(Math.random()*4);

//         particleArray.push(new Particle(x, y, dx, dy, radius, colornumber));
//     }
// }

let lastLevelUpdate = 1;

function gameLoop() {

        
        // enemies = [];
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        ctx.fillStyle = "black";
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        bulletController.draw(ctx);
        player.draw(ctx);


        if (lastLevelUpdate < currentLevel){  // to ensure we only draw that stage once per game loop
          createStage();
          lastLevelUpdate = currentLevel;
        }

        if (enemyY >= 0) {
          createNextStage();
        }



    enemies.forEach((enemy) => {
        if (player.alive && bulletController.collideWith(enemy)) {
          if (enemy.health <= 0) {
            score += 10;
            console.log(`Player obliterated 1 box, new score is ${score}`);
            const index = enemies.indexOf(enemy);
            enemies.splice(index, 1);

          }
        } else {
            player.collideWith(enemy);
            enemy.draw(ctx);
        }
      });




      if (player.alive && paused === false && !resetClicked) {
        animationID = requestAnimationFrame(gameLoop);
        console.log(`request animation ID: ${animationID}`);
      } 
      if (resetClicked) {
        clearScreen();
      }
      

}








// gameLoop();

/** =====================================================================================
 *    O L D  C O D E
 * 
 *          Anything I didn't want to delete just yet for various reasons, lives here
 * 
========================================================================================= 

//replaced with requestAnimationFrame
setInterval(gameLoop, 1000 / 90);


// Original styling function
function setCommonStyle() {
    ctx.shadowColor = "yellow";
    ctx.shadowBlur = 20;            // how much shadow is blurred
    ctx.lineJoin = "bevel";         // beveled edges
    ctx.lineWidth = 5;              // how big the line width is
}



// failed attemps at core game logic
var rows = 5;                       // 5 tiles across
var cols = 5 * levelData.number;    // tiles down

var padding = 2;
var w = (cw - padding * cols) / cols;
var h = (ch - padding * rows) / rows;

// level 1 is x = (1 * levelData.number) by y = (levelData.number * currentLevel) -> 5 across, 5 down = total 35 items in the levelContainer array
// level 2 is x = (1 * levelData.number) by y = (levelData.number * currentLevel)  
// something something levelGridContainer.push(randNumGen)

let blocksPerRow = 4; //levelData.block_arr[randNum(0, 5)];
let dividerPerLine = 3; //levelData.divider_arr[randNum(0, 4)];

let levelGridContainer = [];
function levelGenerator() {
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
            console.log(`coordinate ${x}x, ${y}y`);
            levelGridContainer.push(blockNumGen);
        }
    }
};

var num = [0,0,0].map(function(el,i){
    return this+i;
    },Math.floor(Math.random()*5));

    levelGridContainer.push(new Platform({x:posX, y:posY}));


    var wid = can.width,
    hei = can.height,
    numPlatforms = 14,
    platforms = [],
    hash = {};

for(var i = 0; i < numPlatforms; i++){
  var posX = Math.floor(Math.random()*(wid-tileWidth)/tileWidth) * tileWidth,
    posY = Math.floor(Math.random()*(hei-tileHeight)/tileHeight) * tileHeight;
  
  while (hash[posX + 'x' + posY]){
    posX = Math.floor(Math.random()*wid/tileWidth) * tileWidth;
    posY = Math.floor(Math.random()*hei/tileHeight) * tileHeight;
  }
  
  hash[posX + 'x' + posY] = 1; 
  platforms.push(({x:posX, y:posY}, tileWidth, tileHeight));
}




// explicit xy coordinates for visualization purposes
const enemies2 = [
    new Enemy(10, 10, randNum(1, 20)),       // line 1, 5 blocks per row
    new Enemy(123, 10, randNum(1, 20)),
    new Enemy(236, 10, randNum(2, 20)),
    new Enemy(349, 10, randNum(5, 20)),
    new Enemy(462, 10, randNum(3, 20)),

    new Enemy(10, 123, randNum(4, 20)),     // line 2, 5 blocks per row
    new Enemy(123, 123, randNum(1, 20)),
    new Enemy(236, 123, randNum(10, 20)),
    new Enemy(349, 123, randNum(1, 20)),
    new Enemy(462, 123, randNum(10, 20)),

    // new Enemy(10, 236, randNum(1, 10)),     // line 3, 5 blocks per row
    // new Enemy(123, 236, randNum(1, 10)),
    // new Enemy(236, 236, randNum(1, 10)),
    // new Enemy(349, 236, randNum(1, 10)),
    // new Enemy(462, 236, randNum(1, 10)),

    // new Enemy(10, 349, randNum(1, 10)),     // line 4, 5 blocks per row
    // new Enemy(123, 349, randNum(1, 10)),
    // new Enemy(236, 349, randNum(1, 10)),
    // new Enemy(349, 349, randNum(1, 10)),
    // new Enemy(462, 349, randNum(1, 10)),

    // new Enemy(10, 462, randNum(1, 10)),     // line 5, 5 blocks per row
    // new Enemy(123, 462, randNum(1, 10)),
    // new Enemy(236, 462, randNum(1, 10)),
    // new Enemy(349, 462, randNum(1, 10)),
    // new Enemy(462, 462, randNum(1, 10)),

    // new Enemy(10, 575, randNum(1, 10)),     // line 6, 5 blocks per row
    // new Enemy(123, 575, randNum(1, 10)),
    // new Enemy(236, 575, randNum(1, 10)),
    // new Enemy(349, 575, randNum(1, 10)),
    // new Enemy(462, 575, randNum(1, 10)),
];




    // enemy constructor = x,y,health

original code
function createNextStage(){
    for(let i = 0; i < 1; i++){
      if (randomBoolean()){
        enemies.push(new Enemy(2, i * tileHeight, randNum(1, 20)));      // line 1, 5 blocks per row
        console.log(`createNextStage drew box 1`);
      } 
      if (randomBoolean()){
        enemies.push(new Enemy((1 * tileWidth) + 4, i * tileHeight, randNum(1, 20)));
        console.log(`createNextStage drew box 2`);
      } 
      if (randomBoolean()){
        enemies.push(new Enemy((2 * tileWidth) + 4, i * tileHeight, randNum(1, 20)));
        console.log(`createNextStage drew box 3`);
      } 
      if (randomBoolean()){
        enemies.push(new Enemy((3 * tileWidth) + 4, i * tileHeight, randNum(1, 20)));
        console.log(`createNextStage drew box 4`);
      } 
      if (randomBoolean()){
        enemies.push(new Enemy((4 * tileWidth) + 4, i * tileHeight, randNum(1, 20)));
        console.log(`createNextStage drew box 5`);
      }
  
    }
  }



// canvas.addEventListener('mousemove',mouseMove);

// canvas.addEventListener('mouseout',mouseMove); 
// canvas.addEventListener('mouseover',mouseMove); 
// canvas.addEventListener("contextmenu", function(e){ e.preventDefault();}, false);

// let mouseDown = false;
// canvas.addEventListener('mousedown',mouseMove);
// canvas.addEventListener('mouseup',mouseMove); 

// canvas.onmousedown = function(e) {
//   e.preventDefault();

  
// onmousedown = (e) => {
//   e.preventDefault();
//     if (canvas.onmousedown) {
//       player.shootPressed = true;
//       player.shoot();
//       console.log(`shooting`, this.shootPressed);
//   }
//   // else if (this.canvas.onmouseup) {
//   //   player.shootPressed = false;
//   // }
// }


// }

// if (canvas.onmousedown){
//   player.shootPressed = true;

// } else {
//   player.shootPressed = false;
// }





*/