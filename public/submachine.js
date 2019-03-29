class Submachine extends Gun {
    constructor(name, dmg, force, calibre, shootTime) {
        super(name, dmg, force, calibre, shootTime);
    }

    update(posSol, velocitySol) {
        var xNewVel;
        var yNewVel;

        if (this.time >= this.shootTime) {
            if (keyIsDown(LEFT_ARROW)) {
                xNewVel = -this.force + velocitySol.x;
                yNewVel = 0 + velocitySol.y;
                this.shotProyectile.push(new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre));
                this.time = 0;
            } else if (keyIsDown(RIGHT_ARROW)) {
                xNewVel = this.force + velocitySol.x;
                yNewVel = 0 + velocitySol.y;
                this.shotProyectile.push(new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre));
                this.time = 0;
            } else if (keyIsDown(UP_ARROW)) {
                xNewVel = 0 + velocitySol.x;
                yNewVel = -this.force + velocitySol.y;
                this.shotProyectile.push(new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre));
                this.time = 0;
            } else if (keyIsDown(DOWN_ARROW)) {
                xNewVel = 0 + velocitySol.x;
                yNewVel = this.force + velocitySol.y;
                this.shotProyectile.push(new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre));
                this.time = 0;
            } else {
                this.shotProyectile = [];
            }
        } else {
            this.shotProyectile = [];
        }
        this.time++;
    }

}