class Soldier {
    constructor(name,pos,r,gun,slide,maxHp) {
        this.name = name;
        this.pos = pos;
        this.r = r;
        this.velocity = createVector(0, 0);
        this.force = 2;
        this.slide = slide;
        this.gun = gun;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.kills = 0;
        this.deaths = 0;
    }

    update() {
        var newVel;

        if (keyIsDown(83) && keyIsDown(68)) {
            newVel = createVector(3 * this.force, 3 * this.force);
        } else if (keyIsDown(83) && keyIsDown(65)) {
            newVel = createVector(-3 * this.force, 3 * this.force);
        } else if (keyIsDown(87) && keyIsDown(65)) {
            newVel = createVector(-3 * this.force, -3 * this.force);
        } else if (keyIsDown(87) && keyIsDown(68)) {
            newVel = createVector(3 * this.force, -3 * this.force);
        } else if (keyIsDown(87)) {
            newVel = createVector(0, -3 * this.force);
        } else if (keyIsDown(83)) {
            newVel = createVector(0, 3 * this.force);
        } else if (keyIsDown(68)) {
            newVel = createVector(3 * this.force, 0);
        } else if (keyIsDown(65)) {
            newVel = createVector(-3 * this.force, 0);
        } else {
            newVel = createVector(0, 0);
        }

        this.velocity.lerp(newVel, this.slide);
        this.pos.add(this.velocity);

    }

    changeVel() {
        if (keyIsDown(188)) {
            this.force -= 0.1;
        }
        else if (keyIsDown(190)) {
            this.force += 0.1;
        }
        if (this.force < 0) {
            this.force = 0;
        }
    }

    show() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);

        fill(255, 0, 0);
        rect(this.pos.x - this.r, this.pos.y - this.r / 2, this.r * 2, this.r / 2);
        fill(0, 255, 0);
        var lifeWidth = map(this.hp, 0, this.maxHp, 0, this.r * 2);
        rect(this.pos.x - this.r, this.pos.y - this.r / 2, lifeWidth, this.r / 2);
    }

    constrain() {
        if(this.pos.x <= 0+this.r){
            this.pos.x = 0+this.r;
            this.velocity.mult(0);
        }else if(this.pos.x >= width-this.r){
            this.pos.x = width-this.r;
            this.velocity.mult(0);
        }
        if(this.pos.y <= 0+this.r){
            this.pos.y = 0+this.r;
            this.velocity.mult(0);
        }
        else if(this.pos.y >= height-this.r){
            this.pos.y = height-this.r;
            this.velocity.mult(0);
        }
    }
}

