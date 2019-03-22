class Gun {
    constructor(name, dmg, force, calibre, shootTime) {
        this.name = name;
        this.dmg = dmg;
        this.force = force;
        this.calibre = calibre;
        this.shotProyectile = null;
        this.proyectiles = [];
        this.shootTime = shootTime;
        this.time = this.shootTime;
    }

    update(posSol, velocitySol) {
        var xNewVel;
        var yNewVel;

        if (this.time >= this.shootTime) {
            if (keyIsDown(LEFT_ARROW)) {
                xNewVel = -this.force + velocitySol.x;
                yNewVel = 0 + velocitySol.y;
                this.shotProyectile = new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre);
                this.time = 0;
            } else if (keyIsDown(RIGHT_ARROW)) {
                xNewVel = this.force + velocitySol.x;
                yNewVel = 0 + velocitySol.y;
                this.shotProyectile = new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre);
                this.time = 0;
            } else if (keyIsDown(UP_ARROW)) {
                xNewVel = 0 + velocitySol.x;
                yNewVel = -this.force + velocitySol.y;
                this.shotProyectile = new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre);
                this.time = 0;
            } else if (keyIsDown(DOWN_ARROW)) {
                xNewVel = 0 + velocitySol.x;
                yNewVel = this.force + velocitySol.y;
                this.shotProyectile = new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre);
                this.time = 0;
            } else {
                this.shotProyectile = null;
            }
        }else{
            this.shotProyectile = null;
        }
        this.time++;
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