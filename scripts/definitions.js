
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let boundary = canvas.getBoundingClientRect();
const pi = Math.PI;

//Multiplier to make the canvas higher resolution, helps with sharpness
const resolutionModifier = 3;

//Defining some default particles at the four corners
const particles = [];
//Restraints on particle properties
const minSpeed = 0.5;
const maxSpeed = 3;
const minSize = 5;
const maxSize = 13;

//Object to track position of the mouse and determine whether it is in the canvas.
const mouse = {
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
    inCanvas() {
        let inX = (this.x > boundary.left) && ((this.cx / resolutionModifier) + boundary.left < boundary.right) ? true : false;
        let inY = (this.y > boundary.top) && ((this.cy / resolutionModifier) + boundary.top < boundary.bottom) ? true : false;
        return inY && inX ? true : false;
    }
};

//Maybe worth making a color class? object etc.
function randHue() {return Math.random() * 250};
function getColorValues(color) {
    return color.split('(')[1].split(')')[0].split(',').map(x=>+x);
}
function setColorValues(colorVals) {
    return 'rgb('+colorVals[0]+', '+colorVals[1]+', '+colorVals[2]+', '+colorVals[3]+')'
}

function setOpacity(color, opacity) {
    let vals = getColorValues(color);
    vals[3] = opacity;
    return setColorValues(vals);
}

function avgColor(color1, color2, customOpacity) {
    let vals1 = getColorValues(color1);
    let vals2 = getColorValues(color2);
    
    let r = (vals1[0] + vals2[0]) / 2;
    let g = (vals1[1] + vals2[1]) / 2;
    let b = (vals1[2] + vals2[2]) / 2;
    let a;
    customOpacity ? a = customOpacity : a = (vals1[3] + vals2[3]) / 2;
    
    let newColor = setColorValues([r,g,b,a]);
    return newColor
}

//Particle class dictates default particle properties, somewhat random, limited by variables declared at top
class Particle {
    constructor(xPosition, yPosition) {
        this._x = xPosition;
        this._y = yPosition;
        this._radius = Math.floor((maxSize - minSize) * Math.random() + minSize);
        this._speed = maxSpeed - (this.radius / maxSize)*(maxSpeed-minSpeed) + minSpeed;
        this._direction = Math.random() * 2 * pi;
        this._vicinity = 150 * resolutionModifier;
        this._color = 'rgba('+randHue()+', '+randHue()+', '+randHue()+', 0.8)';
    }

    get x() { return this._x }
    get y() { return this._y }
    get speed() { return this._speed }
    get direction() { return this._direction }
    get radius() { return this._radius }
    get vicinity() { return this._vicinity }
    get color() { return this._color }

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
            else {

                let withinVertical = (this.x + this.radius < canvas.width) && (this.x - this.radius > 0);
                let withinHorizontal = (this.y + this.radius < canvas.height) && (this.y - this.radius > 0);
                
                if(!withinVertical) {
                    this._direction = pi - this.direction;
                }
                if(!withinHorizontal) {
                    this._direction = -this.direction;
                }
            }
        })
    }

    render() {
        ctx.fillStyle = this.color;
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * pi, false);
        ctx.fill()
    }

    renderEdges() {
        let index = particles.indexOf(this);
        
        let a = mouse.cx - this.x;
        let b = mouse.cy - this.y;
        let distance = Math.floor(Math.sqrt(a**2 + b**2));

        if(mouse.inCanvas() && (distance < 1.5 * this.vicinity)) {
            const alpha = 1 - (distance / (1.5 * this.vicinity));
            ctx.strokeStyle = setOpacity(this.color, alpha);
            ctx.lineWidth =  0.5 * this.radius;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.cx, mouse.cy);
            ctx.stroke();
        }

        for (let i = index -1; i >= 0; i--) {
            let p = particles[i];
            a = this.x - p.x;
            b = this.y - p.y;
            distance = Math.floor(Math.sqrt(a**2 + b**2));
            
            if(distance < this.vicinity) {
                const alpha = 0.6 - (distance / (this.vicinity / 0.6));
                ctx.strokeStyle = avgColor(this.color, p.color, alpha);
                ctx.lineWidth = Math.sqrt(this.radius + p.radius);
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke()               
            }
        }
    }
}
