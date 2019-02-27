var soldiers = [];
var checkedColl = false;

function Soldier(id, x, y, r, gun, hp) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.gun = gun;
    this.hp = hp;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

var express = require('express');
var app = express();

var server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

setInterval(sync, 20);

function sync() {
    io.sockets.emit('sync', soldiers);
    checkedColl = false;
    //io.sockets.emit('syncShots', shots);
}

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log("Nuevo usuario: " + socket.id);

    socket.on('start', posMsg);

    function posMsg(data) {
        var hp = 100;
        soldiers.push(new Soldier(socket.id, data.x, data.y, data.r, data.gun, data.hp));
        console.log('{ ' + socket.id + ' X: ' + data.x + ' Y: ' + data.y + " r:" + data.r + " Gun: " + data.gun.name + " HP: " + data.hp + " }");
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
                soldier.r = data.r;
                soldier.gun = data.gun;
                break;
            } else if (i == soldiers.length - 1) {
                soldiers.push(new Soldier(socket.id, data.x, data.y, data.r, data.gun, data.hp));
                break;
            }
        }
        collissions();
    }
    function collissions(){
        for (let i = 0; i < soldiers.length && checkedColl == false; i++) {
            var soldierPri = soldiers[i];
            for (let j = 0; j < soldiers.length; j++) {
                var soldierSec = soldiers[j];
                if(soldierPri.id != soldierSec.id){
                    for (let k = 0; k < soldiers[j].gun.proyectiles.length; k++) {
                        var proyectileSel = soldierSec.gun.proyectiles[k];
                        if (dist(soldierPri.x, soldierPri.y, proyectileSel.x, proyectileSel.y) < soldierPri.r + proyectileSel.r) {
                            console.log(soldierSec.id+" hit "+soldierPri.id+ "with his bullet");
                            soldierPri.hp -= soldierSec.gun.dmg;
                            soldierSec.gun.proyectiles.splice(k,1);
                            checkedColl = true;
                            break;
                        }
                    }
                }
            }
        }
    }
}