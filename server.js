var soldiers = [];
var screenWidth = 1000;
var screenHeight = 650;

var lastUpdate = Date.now();
var deltaTime = lastUpdate-Date.now();

var PROY_DRAG = 0.01;
var MIN_PROY_VEL = 0.2;



function Soldier(id, name, x, y, xVel, yVel, r, gun, maxHp) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.r = r;
    this.gun = gun;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.kills = 0;
    this.deaths = 0;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

var express = require('express');
var app = express();

var server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

setInterval(sync, 10);

function collissions() {
    for (let i = 0; i < soldiers.length; i++) {
        var soldierPri = soldiers[i];
        for (let j = 0; j < soldiers.length; j++) {
            var soldierSec = soldiers[j];
            if (soldierPri.id != soldierSec.id) {
                for (let k = 0; k < soldiers[j].gun.proyectiles.length; k++) {
                    var proyectileSel = soldierSec.gun.proyectiles[k];
                    if (dist( (soldierPri.x+soldierPri.xVel), (soldierPri.y+soldierPri.yVel),
                    (proyectileSel.x+proyectileSel.xVel), (proyectileSel.y+proyectileSel.yVel))
                    < soldierPri.r + proyectileSel.r) {
                        soldierPri.hp -= soldierSec.gun.dmg;
                        if (soldierPri.hp <= 0) {
                            soldierPri.hp = soldierPri.maxHp;
                            soldierPri.deaths++;
                            soldierSec.kills++;
                        }
                        soldierSec.gun.proyectiles.splice(k, 1);
                        break;
                    }
                }
            }
        }
    }
}

function updateProyectiles() {
    for (let i = 0; i < soldiers.length; i++) {
        const soldierSel = soldiers[i];
        for (let j = 0; j < soldierSel.gun.proyectiles.length; j++) {
            const proyectileSel = soldierSel.gun.proyectiles[j];
            proyectileSel.x += proyectileSel.xVel * deltaTime;
            proyectileSel.y += proyectileSel.yVel * deltaTime;
            if (proyectileSel.x < 0 - proyectileSel.r || proyectileSel.x > screenWidth + proyectileSel.r || proyectileSel.y < 0 - proyectileSel.r || proyectileSel.y > screenHeight + proyectileSel.r) {
                soldierSel.gun.proyectiles.splice(j, 1);
            } else if (Math.abs(proyectileSel.xVel) + Math.abs(proyectileSel.yVel) < MIN_PROY_VEL) {
                soldierSel.gun.proyectiles.splice(j, 1);
            } else {
                if (proyectileSel.xVel < 0) {
                    proyectileSel.xVel += PROY_DRAG * deltaTime;
                } else {
                    proyectileSel.xVel -= PROY_DRAG * deltaTime;
                }
                if (proyectileSel.yVel < 0) {
                    proyectileSel.yVel += PROY_DRAG * deltaTime;
                }else{
                    proyectileSel.yVel -= PROY_DRAG * deltaTime;
                }
            }
        }
    }
}

function sync() {
    var now = Date.now();
    deltaTime = now-lastUpdate;

    collissions();
    updateProyectiles();
    io.sockets.emit('sync', soldiers);

    lastUpdate = Date.now();
    //io.sockets.emit('syncShots', shots);
}

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("Nuevo usuario: " + socket.id);

    socket.on('start', posMsg);

    function posMsg(data) {
        soldiers.push(new Soldier(socket.id, data.name, data.x, data.y, data.xVel, data.yVel, data.r, data.gun, data.maxHp));
        console.log('{ ' + socket.id + ' X: ' + data.x + ' Y: ' + data.y + ' xVel: ' + data.xVel + ' yVel: ' + data.yVel + " r:" + data.r + " Gun: " + data.gun.name + " HP: " + data.maxHp + " }");
    }

    socket.on('update', posUpd);

    function posUpd(data) {
        //console.log('{ ' + socket.id + ' X: ' + data.x + ' Y: ' + data.y + " r:" + data.r + " }");
        var soldier;

        for (let i = 0; i < soldiers.length; i++) {
            //console.log(socket.id+" "+soldiers[i].id);
            if (soldiers[i].id == socket.id) {
                soldier = soldiers[i];
                soldier.x = data.x;
                soldier.y = data.y;
                soldier.xVel = data.xVel;
                soldier.yVel = data.yVel;
                soldier.r = data.r;
                //soldier.hp = data.hp;
                soldier.gun.dmg = data.gun.dmg;
                break;
            } else if (i == soldiers.length - 1) {
                soldiers.push(new Soldier(socket.id, data.name, data.x, data.y, data.r, data.gun, data.maxHp));
                break;
            }
        }
    }

    socket.on('shoot', shootUpd);

    function shootUpd(data) {
        for (let i = 0; i < soldiers.length; i++) {
            if (soldiers[i].id == socket.id) {
                for (let j = 0; j < data.proyectile.length; j++) {
                    soldiers[i].gun.proyectiles.push(data.proyectile[j]);
                }
                break;
            }
        }
    }

    socket.on('respawn', respawn);

    function respawn(data) {
        for (let i = 0; i < soldiers.length; i++) {
            if (soldiers[i].id == socket.id) {
                soldiers[i].hp = data.hp;
                break;
            }
        }
    }

    socket.on('disconnect', (reason) => {
        console.log("Client: " + socket.id + " disconnected beacause " + reason);
        for (let i = 0; i < soldiers.length; i++) {
            const sSel = soldiers[i];
            if (sSel.id == socket.id) {
                soldiers.splice(i, 1);
                break;
            }
        }
    });

}