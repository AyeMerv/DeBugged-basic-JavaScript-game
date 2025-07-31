//Canvas variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Player variables
let playerPositionX = 400;
let playerPositionY = 250;
let playerHealth;

//movement variables
let upKey;
let downKey;
let rightKey;
let leftKey;
let speed = 5;

//cursor variables
let mouseX;
let mouseY;
let mouseDown;

//bullet variables
const bulletSpeed = 10;
const bulletDelay = 25;
const bulletDamage = 1;
const bulletX = this.x + this.width/2;
const bulletY = this.y;
let bulletCooldown = 0;
const bullets = [];

//Enemy Variables
let bugs = [];
let bugHealth;
let bugSpawnTimer = 0;
let bugSpawnDelay = 500;

//drawing the canvas and player
const draw = () => {
    if (canvas.getContext) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //rendering player
        ctx.fillStyle = "rgb(0 0 0)";
        ctx.fillRect(playerPositionX, playerPositionY, 25, 50);
        
        //rendering mouse crosshair
        //vertical line
        const crosshairLineLength = 15;
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY - crosshairLineLength);
        ctx.lineTo(mouseX, mouseY + crosshairLineLength);
        ctx.strokeStyle = "rgb(0 0 0)";
        ctx.stroke();
        //horizontal line
        ctx.beginPath();
        ctx.moveTo(mouseX - crosshairLineLength, mouseY);
        ctx.lineTo(mouseX + crosshairLineLength, mouseY);
        ctx.strokeStyle = "rgb(0 0 0)";
        ctx.stroke();        
        //red dot
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(255 0 0)";
        ctx.fill();

        //rendering bullets
        bullets.forEach((bullet) => {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = "rgb(255 255 0)";
            ctx.fill();
        })

        //rendering enemies
        for (let bug of bugs) {
            ctx.beginPath();
            ctx.arc(bug.x, bug.y, bug.radius, 0, 2 * Math.PI);
            ctx.fillStyle = "lime";
            ctx.fill();
        }
    }
}

//constant game loop
const gameLoop = () => {
    //drawing canvas and player in loop
    draw();

    //movement
    if (upKey) { playerPositionY -= speed };
    if (downKey) { playerPositionY += speed };
    if (rightKey) { playerPositionX += speed };
    if (leftKey) { playerPositionX -= speed };


    //lock player within the game world
    playerPositionX = Math.max(0, Math.min(canvas.width - 25, playerPositionX));
    playerPositionY = Math.max(0, Math.min(canvas.height - 50, playerPositionY));

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

    //Delete bullets that leave the canvas
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y> canvas.height) {
            bullets.splice(i, 1);
        }
    }

    //Enemy spawning
    if (bugSpawnTimer <= 0) {
        spawnBug();
        bugSpawnTimer = bugSpawnDelay;
    } else {
        bugSpawnTimer--;
    }

    //Enemies tracking player
    for (let bug of bugs) {
        const dx = playerPositionX + 25 - bug.x;
        const dy = playerPositionY + 25 - bug.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        bug.x += (dx / dist) * bug.speed;
        bug.y += (dy / dist) * bug.speed;
    }

    //Deleting bugs and bullets that collide
    for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    for (let j = bugs.length - 1; j >= 0; j--) {
        const bug = bugs[j];

        const dx = bullet.x - bug.x;
        const dy = bullet.y - bug.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bullet.radius + bug.radius) {
            //remove both
            bug.health -= bulletDamage;
            if (bug.health <= 0) {
                bugs.splice(j, 1);
            }
            bullets.splice(i, 1);
            break; // Move to next bullet
            }
        }
    }

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

//shooting function
const shooting = () => {
    const originX = playerPositionX + 12.5;
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
        radius: 4,
        damage: bulletDamage
    });
}

//Enemy spawn funtion
const spawnBug = () => {
    const edge = Math.floor(Math.random() * 4);
    let x,y;

    if (edge === 0) {
        x = Math.random() * canvas.width;
        y = -20;
    } else if (edge === 1) {
        x = canvas.width + 20;
        y = Math.random() * canvas.height;
    } else if (edge === 2) {
        x = Math.random() * canvas.width;
        y = canvas.height + 20;
    } else {
        x = -20;
        y = Math.random() * canvas.height;
    }

    //Enemy variables
    bugs.push({x, y, radius: 15, speed: 1, health: 1});
}

//starting game loop
gameLoop();