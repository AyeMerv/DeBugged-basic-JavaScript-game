//Canvas variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Player position
let playerPositionX = 400;
let playerPositionY = 250;

//movement variables
let upKey;
let downKey;
let rightKey;
let leftKey;
let speed = 3;

//cursor variables
let mouseX;
let mouseY;
let mouseDown;

//bullet variables
const bulletSpeed = 5;
const bulletDelay = 25;
const bulletDamage = 1;
const bulletX = this.x + this.width/2;
const bulletY = this.y;
let bulletCooldown = 0;
const bullets = [];

//drawing the canvas and player
const draw = () => {
    if (canvas.getContext) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //rendering player
        ctx.fillStyle = "rgb(255 0 255)";
        ctx.fillRect(playerPositionX, playerPositionY, 50, 50);
        
        //rendering mouse crosshair
        //vertical line
        ctx.beginPath();
        ctx.moveTo(mouseX, 0);
        ctx.lineTo(mouseX, canvas.height);
        ctx.strokeStyle = '#000000'; // Black color
        ctx.stroke();
        //horizontal line
        ctx.beginPath();
        ctx.moveTo(0, mouseY);
        ctx.lineTo(canvas.width, mouseY);
        ctx.strokeStyle = '#000000'; // Black color
        ctx.stroke();        
        //red dot
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(255 0 0)";
        ctx.fill();

        //rendering bullets
        bullets.forEach((bullet) => {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 4, 0, 2 * Math.PI); // radius = 5
            ctx.fillStyle = "rgb(255 255 0)";
            ctx.fill();
        })
    }
}

//constant game loop
const gameLoop = () => {
    //drawing canvas and player in loop
    draw();

    //movement
    if (upKey === true) {
        playerPositionY -= speed;
    } else if (downKey === true) {
        playerPositionY += speed;
    } else if (rightKey === true) {
        playerPositionX += speed;
    } else if (leftKey === true) {
        playerPositionX -= speed;
    };

    //shooting
    if (mouseDown && bulletCooldown <= 0) {
        shooting();
        bulletCooldown = bulletDelay;
    }
    if (bulletCooldown > 0) {
        bulletCooldown--;
    }
    bullets.forEach((bullet) => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
    })

    //game loop
    requestAnimationFrame(gameLoop)
}


//Keydwn & Keyup listeners for "WASD" and Arrow keys
document.addEventListener("keydown", (event) => {
    if (event.key === "w" || event.key === "ArrowUp") {
        upKey = true;
    } else if (event.key === "d" || event.key === "ArrowRight") {
        rightKey = true;
    } else if (event.key === "s" || event.key === "ArrowDown") {
        downKey = true;
    } else if (event.key === "a" || event.key === "ArrowLeft") {
        leftKey = true;
    }
});
document.addEventListener("keyup", (event) => {
    if (event.key === "w" || event.key === "ArrowUp") {
        upKey = false;
    } else if (event.key === "d" || event.key === "ArrowRight") {
        rightKey = false;
    } else if (event.key === "s" || event.key === "ArrowDown") {
        downKey = false;
    } else if (event.key === "a" || event.key === "ArrowLeft") {
        leftKey = false;
    }
});

//mousemove event listener to track live mouse position
document.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left - 8;
    mouseY = event.clientY - rect.top - 6;
});

//checking left mouse button clicked
document.addEventListener("mousedown", (event) => {
    mouseDown = true;
});
document.addEventListener("mouseup", (event) => {
    mouseDown = false;
});


const shooting = () => {
    const originX = playerPositionX + 25;
    const originY = playerPositionY + 25;

    const dx = mouseX - originX;
    const dy = mouseY - originY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const vx = (dx / distance) * bulletSpeed;
    const vy = (dy / distance) * bulletSpeed;

    bullets.push({
        x: originX,
        y: originY,
        vx: vx,
        vy: vy,
        damage: bulletDamage
    });
}


gameLoop();