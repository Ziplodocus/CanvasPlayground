
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let boundary = canvas.getBoundingClientRect();
const pi = Math.PI;

//Multiplier to make the canvas higher resolution, helps with sharpness
const resolutionModifier = 2;

//Defining some default particles at the four corners
const particles = [];
//Restraints on particle properties
const minSpeed = 0.5;
const maxSpeed = 3;
const minSize = 3;
const maxSize = 20;

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

class Color {
    constructor(opacity = 0.8) {
        this._r = Math.random() * 255;
        this._g = Math.random() * 255;
        this._b = Math.random() * 255;
        this._a = opacity;
    }
    get r() {return this._r}
    get g() {return this._g}
    get b() {return this._b}
    get a() {return this._a}

    set r(re) {this._r = re;}
    set g(gr) {this._g = gr;}
    set b(bl) {this._b = bl;}
    set a(al) {this._a = al;}

    rgba(opacity = this.a) {return `rgba(${this.r}, ${this.g}, ${this.b}, ${opacity})`}

    static avgColors(colorArr) {
        let vals = {r: [], g: [], b: []};
        let newVals = {r: 0, g: 0, b: 0};
        let avgCol = new Color();
        for (let val in vals) {
            //Pushes all red, green and blue values into separate arrays
            colorArr.forEach(color => {
                vals[val].push(color[val])
            });
            //Assigning a new color value as sum of squares, then sqrt of the mean
            vals[val].forEach(value => {
                newVals[val] += value*value;
            })
            newVals[val] = Math.sqrt( newVals[val] / vals[val].length );
            //Setting the new colors color values as the new ones
            avgCol[val] = newVals[val];
        }
        return avgCol
    }
}

//Particle class dictates default particle properties, somewhat random, limited by variables declared at top
class Particle {
    constructor(xPosition, yPosition) {
        this._x = xPosition;
        this._y = yPosition;
        this._radius = Math.floor((maxSize - minSize) * Math.random() + minSize);
        this._speed = maxSpeed - (this.radius / maxSize)*(maxSpeed-minSpeed) + minSpeed;
        this._direction = Math.random() * 2 * pi;
        this._vicinity = 120 * resolutionModifier;
        this._color = new Color();
        this.lineColor = new Color();
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
        ctx.fillStyle = this.color.rgba();
        ctx.strokeStyle = this.lineColor.rgba();
        ctx.lineWidth = this.radius / 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * pi, false);
        // ctx.fill();
        ctx.stroke();
    }

    renderEdges() {
        let index = particles.indexOf(this);
        
        let a = mouse.cx - this.x;
        let b = mouse.cy - this.y;
        let distance = Math.floor(Math.sqrt(a**2 + b**2));

        if(mouse.inCanvas() && (distance < 1.5 * this.vicinity)) {
            const alpha = 1 - (distance / (1.5 * this.vicinity));
            ctx.lineCap = "round";
            ctx.strokeStyle = this.lineColor.rgba(alpha);
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
                ctx.strokeStyle = (Color.avgColors([this.lineColor, p.lineColor])).rgba(alpha);
                ctx.lineCap = "round";
                ctx.lineWidth = Math.sqrt(this.radius + p.radius);
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke()               
            }
        }
    }
}
