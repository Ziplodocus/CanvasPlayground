
const canvas = document.getElementById('playground');
const ctx = canvas.getContext('2d');
const boundary = canvas.getBoundingClientRect();
const particles = [];
const pi = Math.PI;

class Particle {

    constructor(xPosition, yPosition) {
        this._x = xPosition;
        this._y = yPosition;
        this._speed = Math.floor(9 * Math.random() + 1);
        this._direction = Math.random() * 2 * pi;
        this._radius = Math.floor(9 * Math.random() + 1);
        this._vicinity = 200;
    }

    get x() { return this._x }
    get y() { return this._y }
    get speed() { return this._speed }
    get direction() { return this._direction }
    get radius() { return this._radius }
    get vicinity() { return this._vicinity }

    bounce(edge) {
        switch (edge) {
            case 'horizontal':
                this._direction = (2 * pi - this.direction);
                break
            case 'vertical':
                this._direction = (pi - this.direction);
                break
        }
    }

    render(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fill()
    }

    move() {
        let xComponent = this.speed * Math.cos(this.direction);
        let yComponent = this.speed * Math.sin(this.direction);
        this._x = this.x + xComponent;
        this._y = this.y + yComponent;
    }

    renderEdge(p, context) {

        const a = this.x - p.x;
        const b = this.y - p.y;
        const distance = Math.floor(Math.sqrt(a**2 + b**2));
        
        if(distance < this.vicinity) {
            const alpha = 0.8 - (distance / (this.vicinity / 0.8));
            context.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            context.lineWidth = Math.sqrt(this.radius + p.radius);
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(p.x, p.y);
            context.stroke()
        }
    }
}

function setContext() {
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.strokeStyle = 'hsla(0, 0, 100%, 0.5)';

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
    for (let i=0; i < particles.length; i++) {
        let particle = particles[i];
        particle.move();
        let withinVertical = (particle.x + particle.radius < canvas.width) && (particle.x - particle.radius > 0);
        let withinHorizontal = (particle.y + particle.radius < canvas.height) && (particle.y - particle.radius > 0);
        if(!withinVertical) {
            particle.bounce('vertical')
        }
        if(!withinHorizontal) {
            particle.bounce('horizontal')
        }
        particle.render(ctx);

        for (let j = i-1; j >= 0; j--) {
            particle.renderEdge(particles[j], ctx)
        }
    }
}

setContext();
setInterval(nextFrame, 50);

canvas.addEventListener('click', generateParticle);
