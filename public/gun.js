class Gun {
    constructor(name, dmg, force, calibre, shootTime) {
        this.name = name;
        this.dmg = dmg;
        this.force = force;
        this.calibre = calibre;
        this.shotProyectile = [];
        this.proyectiles = [];
        this.shootTime = shootTime;
        this.time = this.shootTime;
    }

    update(posSol, velocitySol){
        console.log("Abstract class");
    }

    shoot(pos, xVel, yVel, calibre) {
        this.proyectiles.push(new Proyectile(pos.x, pos.y, xVel, yVel, calibre));
    }

    show() {
        for (let i = 0; i < this.proyectiles.length; i++) {
            var proyectilSel = this.proyectiles[i];
            fill(0, 255, 0);
            ellipse(proyectilSel.x, proyectilSel.y, proyectilSel.r*2, proyectilSel.r*2);
            proyectilSel.update();
            if (proyectilSel.x < 0 || proyectilSel.x > width || proyectilSel.y < 0 || proyectilSel.y > height) {
                this.proyectiles.splice(i, 1);
            }
        }
    }
}