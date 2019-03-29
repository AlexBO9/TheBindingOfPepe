class Shotgun extends Gun {

    constructor(name, dmg, force, calibre, shootTime, pellets, dispersion) {
        super(name, dmg, force, calibre, shootTime);
        this.pellets = pellets;
        this.dispersion = dispersion;
    }

    update(posSol, velocitySol) {
        var xNewVel;
        var yNewVel;

        if (this.time >= this.shootTime) {
            if (keyIsDown(LEFT_ARROW)) {
                for (let i = 0; i < this.pellets; i++) {
                    var dispersion = (Math.random() * 2 - 1) * this.dispersion;
                    xNewVel = -this.force + velocitySol.x + Math.abs(dispersion);
                    yNewVel = 0 + velocitySol.y + dispersion;
                    this.shotProyectile.push(new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre));
                    this.time = 0;
                }
            } else if (keyIsDown(RIGHT_ARROW)) {
                for (let i = 0; i < this.pellets; i++) {
                    var dispersion = (Math.random() * 2 - 1) * this.dispersion;
                    xNewVel = this.force + velocitySol.x - Math.abs(dispersion);
                    yNewVel = 0 + velocitySol.y + dispersion;
                    this.shotProyectile.push(new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre));
                    this.time = 0;
                }
            } else if (keyIsDown(UP_ARROW)) {
                for (let i = 0; i < this.pellets; i++) {
                    var dispersion = (Math.random() * 2 - 1) * this.dispersion;
                    xNewVel = 0 + velocitySol.x + dispersion;
                    yNewVel = -this.force + velocitySol.y + Math.abs(dispersion);
                    this.shotProyectile.push(new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre));
                    this.time = 0;
                }
            } else if (keyIsDown(DOWN_ARROW)) {
                for (let i = 0; i < this.pellets; i++) {
                    var dispersion = (Math.random() * 2 - 1) * this.dispersion;
                    xNewVel = 0 + velocitySol.x + dispersion;
                    yNewVel = this.force + velocitySol.y - Math.abs(dispersion);
                    this.shotProyectile.push(new Proyectile(posSol.x, posSol.y, xNewVel, yNewVel, this.calibre));
                    this.time = 0;
                }
            } else {
                this.shotProyectile = [];
            }
        } else {
            this.shotProyectile = [];
        }
        this.time++;
    }
}