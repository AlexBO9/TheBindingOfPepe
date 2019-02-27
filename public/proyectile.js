class Proyectile {
    constructor(x, y, xVel, yVel,r) {
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.r = r;
    }

    update() {
        this.x += this.xVel;
        this.y += this.yVel;
    }
}