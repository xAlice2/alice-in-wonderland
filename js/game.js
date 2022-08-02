const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 573;
canvas.height = 600;

class Entity {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    detectHit(entity){  // passes through an entity
        return overlap(this, entity); // passes through the overlap function to return true/false
    }
    gravity(){
        this.y += gravity;
    }


}

class Player {
    constructor(x, y, bulletController) {
    this.x = x;
    this.y = y;
    this.bulletController = bulletController;
    this.width = 25;
    this.height = 25;
    this.speed = 4;         // movement speed

    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
    }

    // what our player looks like
    draw(ctx) {
        this.move();
        setCommonStyle();
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        this.shoot();
    }

    shoot() {
        if (this.shootPressed) {
            console.log("shoot");
            const speed = 5;
            const delay = 12;
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
            if (this.bullets.length < 7) {  // limits the number of bullets to 3
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
    colors = [
        "#10002b", 
        "#240046", 
        "#3C096C", 
        "#5A189A", 

    ];
    // currentColor = [];
   
    // changeColor() {
    //     for (let i = 0; i < colors.length; i++) {
    //         currentColor.push(colors[i]);
    //     };
    // }

    constructor(x, y, speed, damage){
        this.x = x; 
        this.y = y; 
        this.speed = speed;
        this.damage = damage;

        this.width = 5;
        this.height = 15;
        
        this.color = "red";
    }


    draw(ctx){
        ctx.fillStyle = this.color;
        this.y -= this.speed; // negative because that is how it goes up
        // ctx.shadowColor = "#d53";
        // ctx.shadowBlur = 20; // how much shadow is blurred 
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
    }

    // collission detection
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

class Enemy{
    constructor(x, y, color, health){
        this.x = x;
        this.y = y;
        this.color = color;
        this.health = health;
        this.width = 50;
        this.height = 50;
    }

    draw(ctx){
        ctx.fillStyle = "#240046";  // fill color is this
        if(this.health > 1){
            ctx.strokeStyle = "white"
        }else{                          // if health less than 1, border is color
            ctx.strokeStyle = this.color;
        }
        ctx.shadowBlur = "";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // draw text
        ctx.fillStyle = "#fff";
        ctx.font = "bold 25px Arial"
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
}

// draw(ctx) {
//     this.bullets.forEach((bullet) => {
//         if (this.isBulletOffScreen(bullet)) {
//         const index = this.bullets.indexOf(bullet);
//         this.bullets.splice(index, 1);
//         }

//         bullet.draw(ctx);
//     });
// }



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let randNum = getRandomInt(1, 10);
const randNum2 = Math.floor(Math.random() * 3) + 1;

const tileSpace = 57;
const enemies = [
    new Enemy(5, 5, "gold", getRandomInt(1, 10)),
    new Enemy(62, 5, "gold", getRandomInt(1, 10)),
    new Enemy(119, 5, "gold", getRandomInt(1, 10)),
    new Enemy(176, 5, "gold", getRandomInt(1, 10)),
    new Enemy(233, 5, "gold", getRandomInt(1, 10)),

    new Enemy(290, 5, "gold", getRandomInt(1, 10)),
    new Enemy(347, 5, "gold", getRandomInt(1, 10)),
    new Enemy(404, 5, "gold", getRandomInt(1, 10)),
    new Enemy(461, 5, "gold", getRandomInt(1, 10)),
    new Enemy(518, 5, "gold", getRandomInt(1, 10)),

    new Enemy(5, 62, "gold", getRandomInt(1, 10)),
    new Enemy(62, 62, "gold", getRandomInt(1, 10)),
    new Enemy(119, 62, "gold", getRandomInt(1, 10)),
    new Enemy(176, 62, "gold", getRandomInt(1, 10)),
    new Enemy(233, 62, "gold", getRandomInt(1, 10)),

    new Enemy(290, 62, "gold", getRandomInt(1, 10)),
    new Enemy(347, 62, "gold", getRandomInt(1, 10)),
    new Enemy(404, 62, "gold", getRandomInt(1, 10)),
    new Enemy(461, 62, "gold", getRandomInt(1, 10)),
    new Enemy(518, 62, "gold", getRandomInt(1, 10)),
];

const enemies2 = [
    new Enemy(5, 5, "gold", getRandomInt(1, 10)),
    new Enemy(62, 5, "gold", getRandomInt(1, 10)),
    new Enemy(119, 5, "gold", getRandomInt(1, 10)),
    new Enemy(176, 5, "gold", getRandomInt(1, 10)),
    new Enemy(233, 5, "gold", getRandomInt(1, 10)),

    new Enemy(290, 5, "gold", getRandomInt(1, 10)),
    new Enemy(347, 5, "gold", getRandomInt(1, 10)),
    new Enemy(404, 5, "gold", getRandomInt(1, 10)),
    new Enemy(461, 5, "gold", getRandomInt(1, 10)),
    new Enemy(518, 5, "gold", getRandomInt(1, 10)),

    new Enemy(5, 62, "gold", getRandomInt(1, 10)),
    new Enemy(62, 62, "gold", getRandomInt(1, 10)),
    new Enemy(119, 62, "gold", getRandomInt(1, 10)),
    new Enemy(176, 62, "gold", getRandomInt(1, 10)),
    new Enemy(233, 62, "gold", getRandomInt(1, 10)),

    new Enemy(290, 62, "gold", getRandomInt(1, 10)),
    new Enemy(347, 62, "gold", getRandomInt(1, 10)),
    new Enemy(404, 62, "gold", getRandomInt(1, 10)),
    new Enemy(461, 62, "gold", getRandomInt(1, 10)),
    new Enemy(518, 62, "gold", getRandomInt(1, 10)),
];


function gameLoop() {

    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    bulletController.draw(ctx);
    player.draw(ctx);
    
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
      requestAnimationFrame(draw);
}

function setCommonStyle() {
    ctx.shadowColor = "yellow";
    ctx.shadowBlur = 20;            // how much shadow is blurred
    ctx.lineJoin = "bevel";         // beveled edges
    ctx.lineWidth = 5;              // how big the line width is
}





const bulletController = new BulletController(canvas);
const player = new Player(
    canvas.width / 2.2, 
    canvas.height / 1.3,
    bulletController
);

setInterval(gameLoop, 1000 / 90);