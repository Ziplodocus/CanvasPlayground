
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let boundary = canvas.getBoundingClientRect();
const pi = Math.PI;

//Multiplier to make the canvas higher resolution, helps with sharpness
const resolutionModifier = 2;

//Defining some default particles at the four corners
const particles = [];
//Restraints on particle properties
const options = {
    opacity: 0.8,
    mouseEdges: true,
    edges: true,
    fill: true,
    outline: true,
    minSpeed: 0.5,
    maxSpeed: 1,
    minSize: 5,
    maxSize: 30,
    vicinity: 140,
    initialParticles: 50,
}

//Getting the size of the canvas
let canvasSize = {
    width: getComputedStyle(canvas).width.replace('px',''),
    height: getComputedStyle(canvas).height.replace('px',''),
    area() {
        return this.width * this.height
    }
}

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

//Color class contains the various properties of the color and handy functions for manually altering when required
class Color {
    constructor(opacity = options.opacity) {
        this._r = Math.random() * 255;
        this._g = Math.random() * 255;
        this._b = Math.random() * 255;
        this._a = opacity;
    }
    //Are these getters and setters pointless? should setters be named differently?
    get r() {return this._r}
    get g() {return this._g}
    get b() {return this._b}
    get a() {return this._a}

    set r(re) {this._r = re;}
    set g(gr) {this._g = gr;}
    set b(bl) {this._b = bl;}
    set a(al) {this._a = al;}

    //returns the rgba version of the color, with a parameter option to manually set the opacity
    rgba(opacity = this.a) {return `rgba(${this.r}, ${this.g}, ${this.b}, ${opacity})`}

    //returns a new color from the average values of an array of other colors,
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
        this._radius = Math.floor((options.maxSize - options.minSize) * Math.random() + options.minSize);
        this._speed = options.maxSpeed - (this.radius / options.maxSize)*(options.maxSpeed-options.minSpeed) + options.minSpeed;
        this._direction = Math.random() * 2 * pi;
        this._color = new Color();
        this.lineColor = new Color();
    }

    get x() { return this._x }
    get y() { return this._y }
    get speed() { return this._speed }
    get direction() { return this._direction }
    get radius() { return this._radius }
    get color() { return this._color }

    //Changes the x and y coordinates based on speed and the direction of the particle
    move() {
        let xComponent = this.speed * Math.cos(this.direction);
        let yComponent = this.speed * Math.sin(this.direction);
        this._x = this.x + xComponent;
        this._y = this.y + yComponent;
    }

    //Changes the particles direction when a collision is detected
    //Could reduce number of loops (maybe significantly) by letting this function redirect both particles
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
                //Handles bouncing off of the container
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

    //Draws the particle onto the canvas
    render() {
        ctx.fillStyle = this.color.rgba();
        ctx.strokeStyle = this.lineColor.rgba();
        ctx.lineWidth = this.radius / 5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * pi, false);
        if(options.fill) {ctx.fill()};
        if(options.outline) {ctx.stroke()};
    }

    //Draws edges between particles within a vicinity, and also to the tracked mouse position
    renderEdges() {
        let index = particles.indexOf(this);
        if(options.mouseEdges) {
            let a = mouse.cx - this.x;
            let b = mouse.cy - this.y;
            let distance = Math.floor(Math.sqrt(a**2 + b**2));

            if(mouse.inCanvas() && (distance < 1.5 * options.vicinity)) {
                const alpha = 1 - (distance / (1.5 * options.vicinity));
                ctx.lineCap = "round";
                ctx.strokeStyle = this.lineColor.rgba(alpha);
                ctx.lineWidth = (1.5 * options.vicinity - distance) * this.radius / options.vicinity ;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(mouse.cx, mouse.cy);
                ctx.stroke();
            }
        }

        if(options.edges) {
            for (let i = index -1; i >= 0; i--) {
                let p = particles[i];
                let a = this.x - p.x;
                let b = this.y - p.y;
                let distance = Math.floor(Math.sqrt(a**2 + b**2));
                
                if(distance < options.vicinity) {
                    const alpha = options.opacity - (distance / (options.vicinity / options.opacity));
                    ctx.strokeStyle = (Color.avgColors([this.lineColor, p.lineColor])).rgba(alpha);
                    ctx.lineCap = "round";
                    ctx.lineWidth = (options.vicinity - distance) * (this.radius + p.radius) / options.vicinity ;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke()               
                }
            }
        }
    }
}
