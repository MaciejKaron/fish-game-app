// Canvas setup
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 500

let score = 0
let level = "1 Beginner"
let gameFrame = 0
let gameSpeed = 1
let gameOver = false


//mouse interactivity
let canvasPosition = canvas.getBoundingClientRect()
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', function (event) {
    mouse.click = true
    mouse.x = event.x - canvasPosition.left  // -canvasPosition -> to calculate exact values
    mouse.y = event.y - canvasPosition.top
    // console.log(mouse.x, mouse.y)
})
canvas.addEventListener('mouseup', function () {
    mouse.click = false
})

//Player
const playerLeft = new Image()
playerLeft.src = 'images/fish_swim_left.png'
const playerRight = new Image()
playerRight.src = 'images/fish_swim_right.png'
class Player {
    constructor() {
        this.x = canvas.width     //start position
        this.y = canvas.height/2    //start position
        this.radius = 50
        this.angle = 0
        this.frameX = 0
        this.frameY = 0
        this.frame = 0
        this.spriteWidth = 498
        this.spriteHeight = 327
    }
    update() { // => calculating horizontal and verital distance between player and mouse
        const dx = this.x - mouse.x 
        const dy = this.y - mouse.y
        let theta = Math.atan2(dy, dx) // => calculate player angle
        this.angle = theta
        if (mouse.x != this.x) {
            this.x -= dx/30        // /30 -> to make the animation visible (not immediate). 
        }
        if (mouse.y !== this.y) {
            this.y -= dy/30 
        }
    }
    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
        }
        if (gameFrame % 10 == 0) { // => player swim animation
            this.frame++;
            if (this.frame >= 12) this.frame = 0;
            if ( this.frame == 3 ||  this.frame == 7 ||  this.frame == 11) {
                this.frameX = 0;
            } else this.frameX++;
            if (this.frame < 3){
                this.frameY = 0;
            } else if (this.frame < 7){
                this.frameY = 1;
            } else if (this.frame < 11){
                this.frameY = 2;
            } else this.frameY = 0;
        }

        ctx.fillStyle = 'red'
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // ctx.fill()
        // ctx.closePath()
        // ctx.fillRect(this.x, this.y, this.radius, 10)

        ctx.save() // -> save current canvas settings
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        if (this.x >= mouse.x) {
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,
                this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4, this.spriteHeight / 4) // -> 0 - 60, 0 - 45 (this.x, this.y)
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth,
                this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth / 4, this.spriteHeight / 4)
        }
        ctx.restore() //=> reset translate and rotate
    }
}
const player = new Player()

//bubbles
const bubblesArray = []
const bubbleImage = new Image()
bubbleImage.src = 'images/bubble_pop_1.png'
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + 100 + Math.random() * canvas.height  // -> the appearance of bubbles from below
        this.radius = 50
        this.speed = Math.random() * 5 + 1
        this.distance
        this.counted = false
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2'
    }
    update() {
        this.y -= this.speed
        const dx = this.x - player.x
        const dy = this.y - player.y
        this.distance = Math.sqrt(dx*dx + dy*dy) //Pythagorean theorem
    }
    draw() {
        // ctx.fillStyle = 'blue'
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // ctx.fill()
        // ctx.closePath()
        // ctx.stroke()
        ctx.drawImage(bubbleImage, this.x - 65, this.y -65, this.radius * 2.6, this.radius * 2.6)
    }
}

const bubblePop1 = document.createElement('audio')
bubblePop1.src = 'sounds/pop1.mp3'
const bubblePop2 = document.createElement('audio')
bubblePop2.src = 'sounds/pop2.mp3'

function handleBubbles() {
    if (gameFrame % 50 == 0) {  // -> run this code every 50 frames
        bubblesArray.push(new Bubble()) // -> create new bubble
        // console.log(bubblesArray.length);
    }
    for (let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update()
        bubblesArray[i].draw()
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {  //-> if a bubble behind the map 
            bubblesArray.splice(i, 1) // -> remove from array
            i--
        } else if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
                if (bubblesArray[i].counted == false) {
                    if (bubblesArray[i].sound == 'sound1') {
                        bubblePop1.play()
                    } else {
                        bubblePop2.play()
                    }
                    score++
                    bubblesArray[i].counted = true
                    bubblesArray.splice(i, 1)
                    i--
                }
            }   
    }
}

//background
const background = new Image()
background.src = 'images/background.png'

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height
}

function handleBackground() {
    BG.x1 -= gameSpeed
    if (BG.x1 < -BG.width) {
        BG.x1 = BG.width
    }
    BG.x2 -= gameSpeed
    if (BG.x2 < -BG.width) {
        BG.x2 = BG.width
    }
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height)
    ctx.drawImage(background, BG.x2 - 1, BG.y, BG.width , BG.height)
}

//enemy fish
const enemyImage = new Image()
enemyImage.src = 'images/enemy_fish.png'

class Enemy {
    constructor() {
        this.x = canvas.width + 200
        this.y = Math.random() * (canvas.height - 150) + 90
        this.radius = 60
        this.speed = Math.random() * 2 + 2
        this.frame = 0
        this.frameX = 0
        this.frameY = 0
        this.spriteWidth = 418
        this.spriteHeight = 397
    }
    draw() {
        if (gameFrame % 10 == 0) { // => enemy swim animation
            this.frame++;
            if (this.frame >= 12) this.frame = 0;
            if ( this.frame == 3 ||  this.frame == 7 ||  this.frame == 11) {
                this.frameX = 0;
            } else this.frameX++;
            if (this.frame < 3){
                this.frameY = 0;
            } else if (this.frame < 7){
                this.frameY = 1;
            } else if (this.frame < 11){
                this.frameY = 2;
            } else this.frameY = 0;
        }

        ctx.fillStyle = 'red'
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // ctx.fill()
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
            this.spriteWidth, this.spriteHeight, this.x - 60, this.y - 65, this.radius * 2, this.radius * 2)
    }
    update() {
        this.x -= this.speed
        if (this.x < 0 - this.radius * 2) { // => if behind left border 
            this.x = canvas.width + 200 // => go back to right
            this.y = Math.random() * (canvas.height - 150) + 90 // => random enemy line
            this.speed = Math.random() * 2 + 2; // => random enemy speed
            if (score > 20) {
                level = "2 Easy"
                this.speed = Math.random() * 2 + 3
            } 
            if (score > 40) {
                level = "3 Normal"
                this.speed = Math.random() * 2 + 4
            }
            if (score > 60) {
                level = "4 Hard"
                this.speed = Math.random() * 2 + 5
            }
            if (score > 80) {
                level = "5 Very Hard"
                this.speed = Math.random() * 2 + 6
            }
            if (score > 100) {
                level = "6 Imposible"
                this.speed = Math.random() * 2 + 8
            }
            console.log(this.speed);
        }

        //colisions with player
        const dx = this.x - player.x
        const dy = this.y - player.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < this.radius + player.radius -10) {
            handleGameOver()
        }
    }
}
const enemy1 = new Enemy()

function handleEnemy() {
    enemy1.draw()
    enemy1.update()
}

function handleGameOver() {
    ctx.fillStyle = 'white'
    ctx.fillText('GAME OVER! Your reached score: ' + score, 180, 270)
    gameOver = true
}

//enemy shark
const enemyImage2 = new Image()
enemyImage2.src = 'images/enemy4.png'

class Enemy2 {
    constructor() {
        this.x = canvas.width - 1000
        this.y = Math.random() * (canvas.height - 150) + 90
        this.radius = 60
        this.speed = Math.random() * 2 + 2
        this.frame = 0
        this.frameX = 0
        this.frameY = 0
        this.spriteWidth = 418
        this.spriteHeight = 397
    }
    draw() {
        ctx.fillStyle = 'red'
        // ctx.beginPath()
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        // ctx.fill()
        ctx.drawImage(enemyImage2, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
            this.spriteWidth, this.spriteHeight, this.x - 60, this.y - 65, this.radius * 2, this.radius * 2)
    }
    update() {
        this.x += this.speed
        if (this.x > 800 + this.radius * 2) { // => if behind right border 
            this.x = canvas.width - 1000 // => go back to left
            this.y = Math.random() * (canvas.height - 150) + 90 // => random enemy line
            this.speed = Math.random() * 2 + 2; // => random enemy speed
            if (score > 20) {
                level = "2 Easy"
                this.speed = Math.random() * 2 + 3
            } 
            if (score > 40) {
                level = "3 Normal"
                this.speed = Math.random() * 2 + 4
            }
            if (score > 60) {
                level = "4 Hard"
                this.speed = Math.random() * 2 + 5
            }
            if (score > 80) {
                level = "5 Very Hard"
                this.speed = Math.random() * 2 + 6
            }
            if (score > 100) {
                level = "6 Imposible"
                this.speed = Math.random() * 2 + 8
            }
            console.log(this.speed);
        }
        //colisions with player
        const dx = this.x - player.x
        const dy = this.y - player.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < this.radius + player.radius - 10) {
            handleGameOver()
        }
    }
}
const enemy2 = new Enemy2()

function handleEnemy2() {
    enemy2.draw()
    enemy2.update()
}


// BUBBLE TEXT
let bubbleTextArray = [];
let adjustX = -3;
let adjustY = -3;
ctx.fillStyle = 'white';
ctx.font = '14px Verdana';
ctx.fillText('Bubble', 30, 32);
ctx.fillText('Strugle', 30, 52);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.size = 7;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 15) + 1;
        this.distance;
    }
    draw() {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(34,147,214,1)';
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        if (this.distance < 50){
            this.size = 14;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 4, this.y -4, this.size/3, 0, Math.PI * 2);
            ctx.arc(this.x -6, this.y -6, this.size/5, 0, Math.PI * 2);
        } else if (this.distance <= 80){
            this.size = 8;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 3, this.y -3, this.size/2.5, 0, Math.PI * 2);
            ctx.arc(this.x -4, this.y -4, this.size/4.5, 0, Math.PI * 2);
        }
        else {
            this.size = 5;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x + 1, this.y -1, this.size/3, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.fill()
    }
    update(){
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.distance = distance;
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = 100;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < 100){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/20;
            }
            if (this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/20;
            }
        }
    }
}

function init2() {
    bubbleTextArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                bubbleTextArray.push(new Particle2(positionX * 8, positionY * 8));
            }
        }
    }
}
init2();
console.log(bubbleTextArray);
//bubble text end 


//Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // -> to clear entire canvas from old paint
    for (let i = 0; i < bubbleTextArray.length; i++){ // -> bubble text
        bubbleTextArray[i].draw();
        bubbleTextArray[i].update();
    }
    handleBackground()
    handleBubbles()
    player.update()
    player.draw()
    handleEnemy()
    handleEnemy2()
    ctx.fillStyle = 'black'
    ctx.font = '24px Georgia';
    ctx.fillText('Level: ' + level, 10, 30)
    ctx.fillText('Score: ' + score, 350 , 30)
    gameFrame++  // -> to add periodic event
    if (gameOver == false) {
        requestAnimationFrame(animate) // -> create animation loop
    }
    }
animate()

//if window resolution change
window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect()
})