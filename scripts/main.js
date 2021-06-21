
const canvas = document.getElementById('playground');
const ctx = canvas.getContext('2d');
const mousePosition = {x: 0, y: 0};
const pi = Math.PI;
const resolutionModifier = 3;

class Particle {

    constructor(xPosition, yPosition) {
        this._x = xPosition;
        this._y = yPosition;
        this._radius = Math.floor(8 * Math.random() + 2);
        this._speed = 4 - (this._radius/4);
        this._direction = Math.random() * 2 * pi;
        this._vicinity = 300;
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
                const alpha = 0.7 - (distance / (this.vicinity / 0.7));
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

const particles = [new Particle(100,100), new Particle(500,500), new Particle(1000,1000)];

function setctx() {
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.strokeStyle = 'hsla(0, 0, 100%, 0.5)';
    ctx.save();
}

function mousePos(event) {
    const boundary = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - boundary.left) * resolutionModifier,
        y: (event.clientY - boundary.top) * resolutionModifier
    }
}

function moveCursor(event,) {
    const mouse = mousePos(event);
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
}

function generateParticle(event) {
    const mouse = mousePos(event);
    console.e
    const newParticle = new Particle(mouse.x, mouse.y);
    particles.push(newParticle);
    newParticle.render();
}

function checkCollisions() {
    particles.forEach( particle => {
        particle.collide();
    })
}

function nextFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setctx();
    checkCollisions();
    particles.forEach( particle => {
        particle.renderEdge();

        let withinVertical = (particle.x + particle.radius < canvas.width) && (particle.x - particle.radius > 0);
        let withinHorizontal = (particle.y + particle.radius < canvas.height) && (particle.y - particle.radius > 0);
        if(!withinVertical) {
            particle.bounce('vertical')
        }
        if(!withinHorizontal) {
            particle.bounce('horizontal')
        }
        particle.move();
        particle.render(ctx);  
    })
    
}

setctx();
setInterval(nextFrame, 20);

canvas.addEventListener('click', generateParticle);
canvas.addEventListener('mousemove', moveCursor);