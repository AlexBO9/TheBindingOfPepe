var socket;
let soldiers = [];
let soldier;
let localDeaths;

function setup() {
    createCanvas(window.innerWidth*0.9, window.innerHeight*0.9);
    background(0);
    frameRate(60);

    var guns = [
        {
            "name": "P90",
            "dmg": 15,
            "force": 8,
            "calibre": 8,
            "shootTime": 10
        },
        {
            "name": "Modelo1889",
            "dmg": 5,
            "force": 8,
            "calibre": 4,
            "shootTime": 30,
            "pellets": 8,
            "dispersion": 2
        }
    ]
    var username = getCookie("username");
    var gunNum = parseInt(getCookie("gunNum"));
    var gun;
    localDeaths = 0;
    switch (gunNum) {
        case 0:
            gun = new Submachine(guns[0].name, guns[0].dmg, guns[0].force, guns[0].calibre, guns[0].shootTime);
            break;
        case 1:
            gun = new Shotgun(guns[1].name, guns[1].dmg, guns[1].force, guns[1].calibre, guns[1].shootTime, guns[1].pellets, guns[1].dispersion);
            break;
        default:
            gun = new Submachine(guns[0].name, guns[0].dmg, guns[0].force, guns[0].calibre, guns[0].shootTime);
            break;
    }
    var pos = createVector(random(width), random(height));
    var fortitude = random(30) + 10;
    soldier = new Soldier(username, pos, fortitude, gun, 0.1, fortitude * 4);

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


    if (localDeaths < soldier.deaths) {
        soldier.pos.x = random(width);
        soldier.pos.y = random(height);
        localDeaths = soldier.deaths;
    }

    shootGun();
    sendPosUpdate();
    managePlayers();
    drawScoreboard(width - 200, 40);
}

function managePlayers() {
    for (let i = soldiers.length - 1; i >= 0; i--) {
        if (socket.id != soldiers[i].id) {
            //Draw soldier body
            fill(0, 0, 255);
            ellipse(soldiers[i].x, soldiers[i].y, soldiers[i].r * 2, soldiers[i].r * 2);

            //Draw red life
            fill(255, 0, 0);
            rect(soldiers[i].x - soldiers[i].r, soldiers[i].y - soldiers[i].r / 2, soldiers[i].r * 2, soldiers[i].r / 2);

            //Draw green life
            fill(0, 255, 0);
            var lifeWidth = map(soldiers[i].hp, 0, soldiers[i].maxHp, 0, soldiers[i].r * 2);
            rect(soldiers[i].x - soldiers[i].r, soldiers[i].y - soldiers[i].r / 2, lifeWidth, soldiers[i].r / 2);
        } else {
            soldier.hp = soldiers[i].hp;
            soldier.deaths = soldiers[i].deaths;
        }

        for (let j = 0; j < soldiers[i].gun.proyectiles.length; j++) {
            const proyectileSel = soldiers[i].gun.proyectiles[j];
            fill(255, 0, 0);
            ellipse(proyectileSel.x, proyectileSel.y, proyectileSel.r * 2, proyectileSel.r * 2);
        }

    }
}

function sendPosSetup() {
    var data = {
        name: soldier.name,
        x: soldier.pos.x,
        y: soldier.pos.y,
        xVel: soldier.velocity.x,
        yVel: soldier.velocity.y,
        r: soldier.r,
        gun: soldier.gun,
        maxHp: soldier.maxHp
    }

    socket.emit('start', data);
}
function sendPosUpdate() {
    var data = {
        name: soldier.name,
        x: soldier.pos.x,
        y: soldier.pos.y,
        xVel: soldier.velocity.x,
        yVel: soldier.velocity.y,
        r: soldier.r,
        gun: soldier.gun,
        maxHp: soldier.maxp
    }

    socket.emit('update', data);
}

function shootGun() {
    soldier.gun.update(soldier.pos, soldier.velocity);
    var proyectile = soldier.gun.shotProyectile;
    if (proyectile.length > 0) {
        var data = {
            proyectile: proyectile
        }
        socket.emit('shoot', data);
    }
}
function drawScoreboard(x, y) {
    var cpySoldiers = soldiers.slice(0);
    cpySoldiers.sort(compare);
    textAlign(CENTER);
    textSize(20);
    fill(255);
    text('SCOREBOARD | nom kills deaths', x, y);
    textAlign(LEFT);
    textSize(12);

    for (let i = 0; i < cpySoldiers.length; i++) {
        const sSel = cpySoldiers[i];
        if (i == 0) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }
        text(sSel.name + ' ' + sSel.kills + ' ' + sSel.deaths, x, y + (i + 1) * 25);
    }
}

function compare(a, b) {
    var aKda = a.kills / a.deaths;
    var bKda = b.kills / b.deaths;
    if (aKda > bKda) {
        return -1;
    } else if (bKda > aKda) {
        return 1;
    }
    return 0;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
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
