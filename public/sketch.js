var socket;
let soldiers = [];
let soldier;

function setup() {
    createCanvas(1000, 650);
    background(0);
    frameRate(50);

    var gun = new Gun("p90", 10, 8, 20, 15);
    var pos = createVector(random(width), random(height));
    soldier = new Soldier(pos ,random(50), gun, 0.1);

    socket = io();

    sendPosSetup();

    socket.on('sync', function (data) {
        soldiers = data;
    });
}

function draw() {
    background(0);

    soldier.changeVel();
    soldier.update();
    soldier.constrain();
    soldier.show();

    soldier.gun.update(soldier.pos, soldier.velocity);
    soldier.gun.show();

    showPlayers();
    sendPosUpdate();
}

function showPlayers() {
    for (let i = soldiers.length - 1; i >= 0; i--) {
        if (socket.id != soldiers[i].id) {
            fill(0, 0, 255);
            ellipse(soldiers[i].x, soldiers[i].y, soldiers[i].r * 2, soldiers[i].r * 2);
            for (let j = 0; j < soldiers[i].gun.proyectiles.length; j++) {
                const proyectileSel = soldiers[i].gun.proyectiles[j];
                fill(255, 0, 0);
                ellipse(proyectileSel.x, proyectileSel.y, proyectileSel.r, proyectileSel.r);
            }
        }else{
            soldier.hp = soldiers[i].hp;
        }
    }
}

function sendPosSetup() {
    var data = {
        x: soldier.pos.x,
        y: soldier.pos.y,
        r: soldier.r,
        gun: soldier.gun,
        hp: soldier.hp
    }

    socket.emit('start', data);
}
function sendPosUpdate() {
    var data = {
        x: soldier.pos.x,
        y: soldier.pos.y,
        r: soldier.r,
        gun: soldier.gun,
        hp: soldier.hp
    }

    socket.emit('update', data);
}

//  function sendShotSetup(){
//      var data = {
//          proyectiles: soldier.gun.proyectiles
//     }
//      socket.emit('shotFirst', data);
// }

/* function newDrawing(data) {
    noStroke();
    fill(0,0,255);
    ellipse(data.x, data.y, 36, 36);
} */

/* function mouseDragged() {

    var data = {
        x: mouseX,
        y: mouseY
    }

    socket.emit('mouse', data);

    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 36, 36);
} */
