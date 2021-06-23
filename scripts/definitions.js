const canvas = document.getElementById('playground');
const ctx = canvas.getContext('2d');
let boundary = canvas.getBoundingClientRect();
const pi = Math.PI;
const resolutionModifier = 3;
const particles = [];

const mouse = {
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
    inCanvas() {
        let inX = (this.x > boundary.left) && ((this.cx / resolutionModifier) + boundary.left < boundary.right) ? true : false;
        let inY = (this.y > boundary.top) && ((this.cy / resolutionModifier) + boundary.top < boundary.bottom) ? true : false;
        return inY && inX ? true : false;
    },
    render() {
        if(this.inCanvas()) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            particles.forEach(p => {
                const a = this.cx - p.x;
                const b = this.cy - p.y;
                const distance = Math.floor(Math.sqrt(a**2 + b**2));
                
                if(distance < 1.3 * p.vicinity) {
                    const alpha = 0.8 - (distance / (1.3 * p.vicinity / 0.8));
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 1 * p.radius;
                    ctx.beginPath();
                    ctx.moveTo(this.cx, this.cy);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                }
            })
        }
    }
};


class Particle {

    constructor(xPosition, yPosition) {
        this._x = xPosition;
        this._y = yPosition;
        this._radius = Math.floor(8 * Math.random() + 3);
        this._speed = 1.5 - (this._radius/8);
        this._direction = Math.random() * 2 * pi;
        this._vicinity = 100 * resolutionModifier;
    }

    get x() { return this._x }
    get y() { return this._y }
    get speed() { return this._speed }
    get direction() { return this._direction }
    get radius() { return this._radius }
    get vicinity() { return this._vicinity }

    move() {
        let xComponent = this.speed * Math.cos(this.direction);
        let yComponent = this.speed * Math.sin(this.direction);
        this._x = this.x + xComponent;
        this._y = this.y + yComponent;
    }

    collide() {
        particles.forEach(p => {
            if(this !== p) {

                const xDiff = p.x - this.x;
                const yDiff = p.y - this.y;

                const distance = Math.sqrt(xDiff**2 + yDiff**2);
                const radii = this.radius + p.radius;
                const isCollision = (distance <= radii);
                
                if(isCollision) {

                    let anglePerp = Math.acos(Math.abs(xDiff/radii));
                    if(-xDiff*yDiff > 0) {
                        anglePerp = -anglePerp;
                    }
                    if(Math.sign(xDiff) > 0) {
                        anglePerp = anglePerp + pi;
                    }

                    this._direction = anglePerp;

                    //currently bouncing off each other at the perpendicular
                }
            }
        })
    }

    bounce(edge) {
        switch (edge) {
            case 'horizontal':
                this._direction = -this.direction;
                break
            case 'vertical':
                this._direction = pi - this.direction;
                break
        }
    }

    render() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3';
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill()
    }

    renderEdge() {
        let index = particles.indexOf(this);
        
        for (let i = index -1; i >= 0; i--) {
            let p = particles[i];
            const a = this.x - p.x;
            const b = this.y - p.y;
            const distance = Math.floor(Math.sqrt(a**2 + b**2));
            
            if(distance < this.vicinity) {
                const alpha = 0.5 - (distance / (this.vicinity / 0.5));
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = Math.sqrt(this.radius + p.radius);
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke()               
            }
        }
    }
}
