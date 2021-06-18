
const canvas = document.getElementById('playground');
const ctx = canvas.getContext('2d');
const boundary = canvas.getBoundingClientRect();
console.log(boundary);
console.log(canvas.height, canvas.width);
const particles = [];
const pi = Math.PI;

class Particle {

    constructor(xPosition,yPosition) {
        this._x = xPosition;
        this._y = yPosition;
        this._speed = 1;
        this._direction = Math.random() * 2 * pi;
        this._size = Math.floor(9 * Math.random() + 1);
    }

    get x() { return this._x}
    get y() { return this._y}
    get speed() { return this._speed}
    get direction() { return this._direction}
    get size() { return this._size}

    bounce(edge) {
        switch (edge) {
            case 'horizontal':
                this._direction = (2 * pi - this.direction) % 2 * pi;
                break
            case 'vertical':
                this._direction = (pi - this.direction) % 2 * pi;
                break
        }
    }

    render(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
        context.fill()
    }

    move() {
        let xComponent = this.speed * Math.cos(this.direction);
        let yComponent = this.speed * Math.sin(this.direction);
        this._x = this.x + xComponent;
        this._y = this.y + yComponent;
    }
}

function setContext() {
    ctx.lineWidth = 0.2;
    ctx.fillStyle = '#50FFB1';
    ctx.strokeStyle = 'hsla(0, 0%, 0%, 50%)';
    ctx.shadowBlur = 0.1;
    ctx.shadowColor = 'hlsa(0, 20%, 0%, 80%)';
    ctx.shadowOffsetX = 0.1;
    ctx.save();
}

function generateParticle(event) {
    const mousePos = {
        x: (event.clientX - boundary.left) / (boundary.right - boundary.left) * canvas.width,
        y: (event.clientY - boundary.top) / (boundary.bottom - boundary.top) * canvas.height
    };

    const newParticle = new Particle(mousePos.x, mousePos.y);
    newParticle.render(ctx);
    particles.push(newParticle);
}

function nextFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (particle of particles) {
        particle.move();
        let withinVertical = (particle.x < canvas.width) && (particle.x > 0);
        let withinHorizontal = (particle.y < canvas.height) && (particle.y > 0);
        if(!withinVertical) {
            particle.bounce('vertical')
        }
        if(!withinHorizontal) {
            particle.bounce('horizontal')
        }
        particle.render(ctx);
    }
}

setInterval(nextFrame, 10);

setContext();
canvas.addEventListener('click', generateParticle);
