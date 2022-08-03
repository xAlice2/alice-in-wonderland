const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 576;
canvas.height = 803;
const tSize = canvas.width / 5 - 12;
const playerTile = 30;
//row = 114.6

const cw = 572;
const ch = 803;

let gravity = 0.4;

var mouse = {
    x: window.innerWidth/2,
    y: window.innerHeight/2
}





const amoutofballs = 5;
let particleArray = [];

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
        // this.width = tSize;
        // this.height = tSize;
        this.speed = 4;         // movement speed
        this.health =  5;


        document.addEventListener('keydown', this.keydown);
        document.addEventListener('keyup', this.keyup);
    }
    
    // what our player looks like
    draw(ctx) {
        this.move();
        // setCommonStyle();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "lightgreen";
        ctx.shadowColor = "green";  //98D7d1
        ctx.shadowBlur = 15; 
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 1;
        // ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        
        ctx.fillStyle = "black";
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.arc(this.x + 15, this.y + 13.5, 25, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
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
    }
    


 /** ==================================================================
  * Bug: delay seems to push the tiles back and slow the entire column
  * 
  */

    shoot() {
        if (this.shootPressed) {
            console.log("pew");
            const speed = 5;
            const delay = 10;
            const damage = 1;
            const bulletX = this.x + this.width/2;
            const bulletY = this.y;
            this.bulletController.shoot(bulletX, bulletY, speed, damage, delay);
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
        if (e.code === "Space") {
          this.shootPressed = true;
        }

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
        if (e.code === "Space") {
          this.shootPressed = false;
        }
      };


}
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
            this.bullets.splice(index, 1);
            }

            bullet.draw(ctx);
        });
    }

    isBulletOffScreen(bullet) {
        return bullet.y <= -bullet.height;
    }
    collideWith(sprite){
        return this.bullets.some(bullet =>{
            if(bullet.collideWith(sprite)) {
                this.bullets.splice(this.bullets.indexOf(bullet),1);
                return true;
            }
            return false;
        })
    
    }

}
const currentColor = [];
class Bullet{

    constructor(x, y, speed, damage){
        this.x = x; 
        this.y = y; 
        this.speed = speed;
        this.damage = damage;

        this.width = 5;
        this.height = 15;
        
        this.color = "yellow";
    }


    draw(ctx){
        ctx.fillStyle = this.color;
        this.y -= this.speed; // negative because that is how it goes up
        // ctx.shadowColor = "#d53";
        // ctx.shadowBlur = 20; // how much shadow is blurred 
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
    }

    // collision detection
    collideWith(sprite) {
        if (
          this.x < sprite.x + sprite.width &&
          this.x + this.width > sprite.x &&
          this.y < sprite.y + sprite.height &&
          this.y + this.height > sprite.y
        ) {
          sprite.takeDamage(this.damage);
          return true;
        }
        return false;
      }
}


/** -------------------------------------------------------------
 *   Player Two constructor
 * 
 *                  --decreases gravity on mouse click
 * -------------------------------------------------------------- */

 let colors = [
    {r: 44, g: 62, b: 80},
    {r: 231, g: 76, b: 60},
    {r: 236, g: 240, b: 241},
    {r: 52, g: 152, b: 219}
    ];

    class Particle extends Player{
        constructor(x, y, dx, dy, radius, colornumber) {
            super(player.x, player.y, playerTile, playerTile);
            this.x = x;
            this.y = y;
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
        this.y = y;
        this.health = health;
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
        
    }

    takeDamage(damage) {
        this.health -= damage;
    }

    isEnemyOffScreen(bullet) {
        return bullet.y <= -bullet.height;
    }
}

/** ----------------------------------------------------------------------------
 * Helper function2 -
 * 
 *
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
    return Math.random() < 0.5;
}


/** ----------------------------------------------------------------------------
 * Collision detection -
 * 
 *                      Not working ... 
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
 *
 ----------------------------------------------------------------------------- */


// var snakeHeadW = 22;        //snake head width
// var snakeTailW = 14;        //snake tail width
// var dividerW = 5;           //divider width
// var blockW = 100;           //block width
// var snakePositionY = 600;   //snake positon y
// let currentLevel = 2;         // current level
// let score = 0;
// let blockHPGen = randNum(1, 10); 

// var levelData = {
//     number:5, 			//starting block number
//     block_arr:[4,5,3,2,4,5], 	//how many blocks per line (maximum 5)
//     divider_arr:[1,2,3,1,2], 	//how many divider per line (maximum 5)

//     gap_arr:[4,3,4,3,2], 		//how many gap after each block

//     moveSpeed:3, 			//screen move speed
//     numberIncrease:1, 		//number increase
//     moveSpeedIncrease:.5, 	//move speed increase
//     gridNextLevel:2,

// }; 		


/**--------------------------------------------------------
cw = 572;
ch = 803;
 */


// var rows = 5;                       // 5 tiles across
// var cols = 5 * levelData.number;    // tiles down

// var padding = 2;
// var w = (cw - padding * cols) / cols;
// var h = (ch - padding * rows) / rows;

// // level 1 is x = (1 * levelData.number) by y = (levelData.number * currentLevel) -> 5 across, 5 down = total 35 items in the levelContainer array
// // level 2 is x = (1 * levelData.number) by y = (levelData.number * currentLevel)  
// // something something levelGridContainer.push(randNumGen)

// let blocksPerRow = 4; //levelData.block_arr[randNum(0, 5)];
// let dividerPerLine = 3; //levelData.divider_arr[randNum(0, 4)];

// let levelGridContainer = [];
// function levelGenerator() {
//     for (var y = 0; y < rows; y++) {
//         for (var x = 0; x < cols; x++) {
//             console.log(`coordinate ${x}x, ${y}y`);
//             levelGridContainer.push(blockNumGen);
//         }
//     }
// };

// var num = [0,0,0].map(function(el,i){
//     return this+i;
//     },Math.floor(Math.random()*5));

//     levelGridContainer.push(new Platform({x:posX, y:posY}));

//     const tileWidth = canvas.width / 5 - 2;  // we want 5 tiles of 113 across the width of screen
//     const tileHeight = canvas.height / 5 - 2; 
//     var wid = can.width,
//     hei = can.height,
//     numPlatforms = 14,
//     platforms = [],
//     hash = {};

// for(var i = 0; i < numPlatforms; i++){
//   var posX = Math.floor(Math.random()*(wid-tileWidth)/tileWidth) * tileWidth,
//     posY = Math.floor(Math.random()*(hei-tileHeight)/tileHeight) * tileHeight;
  
//   while (hash[posX + 'x' + posY]){
//     posX = Math.floor(Math.random()*wid/tileWidth) * tileWidth;
//     posY = Math.floor(Math.random()*hei/tileHeight) * tileHeight;
//   }
  
//   hash[posX + 'x' + posY] = 1; 
//   platforms.push(({x:posX, y:posY}, tileWidth, tileHeight));
// }

/**
 *  shuffle block array
 *  shuffle divider array
 *  shuffle gap array
 *  push randNum's generated numbers into level container
 */

    // enemy constructor = x,y,health

/*-------------------------------------------------------------------
 * 
 * CREATE DIVIDER here
 * 
 */




// test for visualization
// math: xy * 113 = 5 blocks per row


const enemies = [
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








/** ----------------------------------------------------------------------------
 * Game Loops -
 * 
 *          runs like a hamster on a wheel
 ----------------------------------------------------------------------------- */

//  var amoutofballs = 5;
//  var particleArray = [];

//  function init() {
//     for (var i = 0; i < amoutofballs; i++) {
//         var radius = (Math.random()*5);
//         var x = mouse.x;
//         var y = mouse.y;
//         var dx = (Math.random()-0.5)*5;
//         var dy = (Math.random()-0.5)*5;
//         var colornumber = Math.floor(Math.random()*4);

//         particleArray.push(new Particle(x, y, dx, dy, radius, colornumber));
//     }
// }

function gameLoop() {
    
        requestAnimationFrame(gameLoop);
        // ctx.clearRect(0, 0, innerWidth, innerHeight);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        bulletController.draw(ctx);
        player.draw(ctx);
        // levelGenerator();

        for (var i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
        }
  

    // current level variables
    // gameData.level_arr = [];
	// gameData.block_arr = [];
	// gameData.divider_arr = [];


	// gameData.tailCount = 1;
	// gameData.create = false;
	// gameData.gridType = 1;

	// // gameData.timer = new Date();
	// gameData.moveSpeed = levelData.moveSpeed;
	// gameData.gridCount = 0;
	// gameData.number = levelData.number;

    //test enemy
    // new Enemy(100,100, "yellow", 10).draw(ctx);

    enemies.forEach((enemy) => {
        if (bulletController.collideWith(enemy)) {
          if (enemy.health <= 0) {
            const index = enemies.indexOf(enemy);
            enemies.splice(index, 1);
          }
        } else {
          enemy.draw(ctx);
        }
      });

    for (var i = 0; i < 3; i++) {
        spawnBalls();
    }
    
    function spawnBalls() {
        for (var i = 0; i < amoutofballs; i++) {
            var radius = (Math.random()*5);
            var x = this.x;
            var y = this.y;
            var dx = (Math.random()-0.5)*5;
            var dy = (Math.random()-0.5)*5;
            var colornumber = Math.floor(Math.random()*4);
    
            particleArray.push(new Particle(x, y, dx, dy, radius, colornumber));
        }
    }



    
    
}


window.addEventListener("mousemove", function(e) {
    mouse.x = e.x;
    mouse.y = e.y;

    spawnBalls();
});




const bulletController = new BulletController(canvas);

const player = new Player(
    canvas.width / 2.2, 
    canvas.height / 1.3,
    bulletController
);

let playerX = player.x;
let playerY = player.y;

gameLoop();

/**
 * Old Code
 * 
 */

// setInterval(gameLoop, 1000 / 90);

// function setCommonStyle() {
//     ctx.shadowColor = "yellow";
//     ctx.shadowBlur = 20;            // how much shadow is blurred
//     ctx.lineJoin = "bevel";         // beveled edges
//     ctx.lineWidth = 5;              // how big the line width is
// }