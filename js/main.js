    // GLOBAL DOM / VARIABLES
    document.addEventListener('DOMContentLoaded', main);

    function main() {
        const canvas = document.getElementById("game__container"); // Grabbing the canvas and setting/grabbing the context
        const ctx = canvas.getContext('2d');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;


        // const movement = document.getElementById('movement');
        // const movement2 = document.getElementById('movement-2');

        const reset = document.getElementById('reset');
        const start = document.getElementById('start');


        const score = document.getElementById('score');
        const status = document.getElementById('status');
        let scoreValue = 0;
        score.textContent = scoreValue;



        let player1;
        const tailCount = []; // to keep track of how many blocks the player has
        const mouse = {
            x: undefined,
            y: undefined,
        }


        let entities = [];
        let boxes = [];


        
        let wPressed = false;
        let aPressed = false;
        let sPressed = false;
        let dPressed = false;
        let spacePressed = false;   // space for pause

    // ====================== PAINT INTIAL SCREEN ======================= //

    // Filling in the canvas background with a black rectangle

    

    // EVENT LISTENERS

    function init() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        start.addEventListener('click', startGame);
    }


    
    canvas.addEventListener('mousemove', function(event) {      // grabs the mouse position 
        mouse.x = event.x;
        mouse.y = event.y;
        console.log(mouse.x, mouse.y);
    });
    


    // ====================== SETUP FOR CANVAS RENDERING ======================= //
    // 2D rendering context for canvas element.
    // It is used for drawing shapes, text, images, and other objects.

        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

    
    
    // ====================== ENTITIES ======================= //

// Setting the gravity to be applied to the Player on the y axis
// const gravity = 0.05

// Setting up Player Class
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        },
        this.width = 100
        this.height = 100
        // Initializing velocity at 0
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    draw() {
        // Drawing Player
        // rect(this.position, this.width, this.height)
        ctx.strokeStyle = 'white'
        ctx.fillStyle = 'blue'
        ctx.fillRect(
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
            )
    }

    update() {
        // Update runs in the recursive animate function so it will constantly update the Player on the canvas 
        this.draw()

        // // Players position on the y axis is increased by the velocity 
        // this.position.y += this.velocity.y

        // // Players position on the x axis is increased by the velocity 
        // this.position.x += this.velocity.x

        // // If Players position on the y axis plus the players height (which will give us the bottom of the Player) plus the velocity of the player on the y axis is less than the canvas height then add gravity, else set velocity equal to zero, effectively stopping the player from falling through the bottom of the canvas.
        // if (this.position.y + this.height + this.velocity.y <= canvas.height)
        // {this.velocity.y += gravity
        // } else {
        //     this.velocity.y = 0
        // }
    }
}

    function startGame() {
    // entities.push(snake);
        player1 = new Player({
            position: {
                x: 0,
                y: 0
            } //,
            // velocity: {
            //     x: 0,
            //     y: 0
            // }
        })

    }


    // ====================== HELPER FUNCTIONS ======================= //



    function animate() {
        window.requestAnimationFrame(animate)
        console.log('this works')
    }


    // add snake tails function on collision
    // remove snake tails on collision



    

    

    //  GUI
    
    //  KEYBOARD INTERACTION LOGIC
    
    // ====================== GAME PROCESSES ======================= //
    
    // ====================== COLLISION DETECTION ======================= //

}

/**
 * Code stashing
 * 
 */

        // const blocks = document.createElement('img');
        // const mushroom = document.createElement('img');
        // const heart = document.createElement('img');
        // blocks.setAttribute('src', 'img/icons8-block-100.png');
        // mushroom.setAttribute('src', 'img/icons8-amanita-100.png');
        // heart.setAttribute('src', 'img/icons8-heart-100.png');


            // function restartGame() {
    //     if (endGame) {
    //         scoreValue = 0;
    //         score.textContent = scoreValue;
    //         status.textContent = 'Game restarted';
    //         entities = [];
    //         projectiles = [];
    //         donkey = new Crawler(50, 50, 'blue', 35, 35);
    //         entities.push(donkey);
    //         shrek = new Crawler(300,300, 'green', 100, 35, 'ogre');
    //         entities.push(shrek);
    //         endGame = false;
    //     }
    // }


    // function addNewShrek() {
    //     if (shrek.alive) {
    //         shrek.alive = false;
    //         setTimeout(function() {
    //             entities.pop();
    //             let x = Math.floor(Math.random() * canvas.width) - 40;
    //             let y = Math.floor(Math.random() * canvas.height) - 80;
    //             shrek = new Crawler(x, y, 'green', 75, 100, 'ogre');
    //             shrek.alive == true;
    //             // shrek.setMovement();
    //             entities.push(shrek);
    //         }, 3000);
    //         return true;
    //     }
    // }

        // reset.addEventListener('click', restartGame, false);  fix later