    // GLOBAL DOM / VARIABLES
    document.addEventListener('DOMContentLoaded', main);

    function main() {
        const canvas = document.getElementById("game");
        const ctx = canvas.getContext('2d');
        const movement = document.getElementById('movement');
        const movement2 = document.getElementById('movement-2');
        const score = document.getElementById('scoreTest');
        const status = document.getElementById('status');
        const reset = document.getElementById('reset');
        let scoreValue = 0;
        score.textContent = scoreValue;
        const blocks = document.createElement('img');
        const mushroom = document.createElement('img');
        const heart = document.createElement('img');
        blocks.setAttribute('src', 'img/icons8-block-100.png');
        mushroom.setAttribute('src', 'img/icons8-amanita-100.png');
        heart.setAttribute('src', 'img/icons8-heart-100.png');

        let entities = [];
        let projectiles = [];


        
        let wPressed = false;
        let aPressed = false;
        let sPressed = false;
        let dPressed = false;
        let spacePressed = false;   // space for pause

    // ====================== PAINT INTIAL SCREEN ======================= //
    

    // EVENT LISTENERS

    reset.addEventListener('click', restartGame, false);


    function keyUpHandler(event) {
        if(event.code == 'KeyW') {
            wPressed = false;
        } else if (event.code === 'KeyA') {
            aPressed = false;
        } else if (event.code === 'KeyS') {
            sPressed = false;
        } else if (event.code === 'KeyD') {
            dPressed = false;
        }
    }

    // ====================== SETUP FOR CANVAS RENDERING ======================= //
    // 2D rendering context for canvas element.
    // It is used for drawing shapes, text, images, and other objects.

    canvas.setAttribute('height', window.innerHeight);
    canvas.setAttribute('width', window.innerWidth);
    ctx.height = canvas.height;
    ctx.width = canvas.width;

    
    
    // ====================== ENTITIES ======================= //

    // ====================== HELPER FUNCTIONS ======================= //

    function restartGame() {
        if (endGame) {
            scoreValue = 0;
            score.textContent = scoreValue;
            status.textContent = 'Game restarted';
            entities = [];
            projectiles = [];
            donkey = new Crawler(50, 50, 'blue', 35, 35);
            entities.push(donkey);
            shrek = new Crawler(300,300, 'green', 100, 35, 'ogre');
            entities.push(shrek);
            endGame = false;
        }
    }
    
    //  GUI
    
    //  KEYBOARD INTERACTION LOGIC
    
    // ====================== GAME PROCESSES ======================= //
    
    // ====================== COLLISION DETECTION ======================= //

}