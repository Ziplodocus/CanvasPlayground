
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
    fill: false,
    outline: true,
    minSpeed: 1,
    maxSpeed: 2,
    minSize: 50,
    maxSize: 50,
    vicinity: 200,
    initialParticles: 20,

    speed() {
        return Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    }
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

const vtr = {
    dot(a, b) {
        const result = a.reduce((acc, cur, i) => {
            acc += cur * b[i];
            return acc;
        }, 0);
        return result;
    },
    norm(array) {
        const sumOfSquares = array.reduce((accrue, current) => {
            accrue += current**2;
            return accrue;
        })
        return Math.sqrt(sumOfSquares);
    },
    mult(array, multi) {return array.map(val => val*multi);},
    add(arrayOfVectors) {
        let addedVtr = [];
        let sum;
        for (let i = 0; i < arrayOfVectors[0].length; i++) {
            sum = 0;
            for (let j = 0; j < arrayOfVectors.length; j++) {
                sum += arrayOfVectors[j][i]
            }
            addedVtr.push(sum);
        }
        return addedVtr;
    }
}

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
    constructor( xPosition, yPosition, speed, directionRadeons ) {
        this._x = xPosition;
        this._y = yPosition;
        this._vx = speed * Math.cos(directionRadeons);
        this._vy = speed * Math.sin(directionRadeons);
        this._color = new Color();
        this._lineColor = new Color();
        this._radius = options.minSize + (options.maxSize - options.minSize) * ((speed - options.minSpeed) / (options.maxSpeed - options.minSpeed));
    }

    get x() { return this._x }
    get y() { return this._y }
    get vx() { return this._vx }
    get vy() { return this._vy }
    get color() { return this._color }
    get lineColor() { return this._lineColor }
    get radius() { return this._radius }
    
    get speed() { return Math.sqrt( this.vx**2 + this.vy**2 ) }
    get direction() { return Math.acos( this.vx / this.speed ) }
    get mass() { return 4/3 * pi * this.radius**3 }


    set setX( xPos ) { this._x = xPos }
    set setY( yPos ) { this._y = yPos }
    set setVx( x_velocity ) { this._vx = x_velocity }
    set setVy( y_velocity ) { this._vy = y_velocity }


    //Changes the x and y coordinates based on speed and the direction of the particle
    move() {
        this.setX = this.x + this.vx;
        this.setY = this.y + this.vy;
    }

    //Changes the particles direction when a collision is detected
    //Could reduce number of loops (maybe significantly) by letting this function redirect both particles
    collide() {
        for ( let i = particles.indexOf(this)+1; i < particles.length; i++ ) {
            let p = particles[i];
            let a = this.x - p.x;
            let b = this.y - p.y;
            const distance = Math.hypot(a, b);
            const radii = this.radius + p.radius;
            const isCollision = (distance <= radii);
            
            if(isCollision) {
                // if (distance < radii) {
                //     const angleOfCollision = Math.atan( a / b );
                //     let ratio = this.radius / radii;
                //     let inset = distance - radii;

                //     this.setX = this.x + ratio * Math.cos(angleOfCollision) * inset;
                //     this.setY = this.y + ratio * Math.sin(angleOfCollision) * inset;
                //     p.setX = p.x - (1-ratio) * Math.cos(angleOfCollision) * inset;
                //     p.setY = p.y - (1-ratio) * Math.sin(angleOfCollision) * inset;
                // }



                let velociDiff = [this.vx - p.vx, this.vy - p.vy];
                let posiDiff = [this.x - p.x, this.y - p.y];
                let velociDiff2 = vtr.mult(velociDiff, -1);
                let posiDiff2 = vtr.mult(posiDiff, -1);
                
                // let thisVChange = vtr.mult( posiDiff, -( 2 * p.mass / (this.mass + p.mass) ) * (vtr.dot(velociDiff, posiDiff) / vtr.norm(posiDiff)**2) );
                // console.log('change: ' + vtr.norm(thisVChange));
                // let pVChange = vtr.mult( posiDiff2, -( -2 * this.mass / (this.mass + p.mass) ) * (vtr.dot(velociDiff2, posiDiff2) / vtr.norm(posiDiff2)**2) );
                // let thisV = vtr.add([[this.vx, this.vy], thisVChange]);
                // let pV = vtr.add([[p.vx, p.vy], pVChange]);

                // this.setVx = thisV[0];
                // this.setVy = thisV[1];
                // p.setVx = pV[0];
                // p.setVy = pV[1];
                let vxchange = this.vx * Math.cos(Math.atan2(velociDiff[1] / velociDiff[0]));
                let vychange = this.vy * Math.sin(Math.atan2(velociDiff[1] / velociDiff[0]));
                let pvxchange = p.vx * Math.cos(Math.atan2(velociDiff2[1] / velociDiff2[0]));
                let pvychange = p.vy * Math.sin(Math.atan2(velociDiff2[1] / velociDiff2[0]));
                console.log(vxchange);
                console.log(vychange);

                [this.setVx, this.setVy, p.setVx, p.setVy] = [vxchange, vychange, pvxchange, pvychange];
            }
        }
        //Handles bouncing off of the container
        let withinVertical = (this.y + this.radius < canvas.height) && (this.y - this.radius > 0);
        let withinHorizontal = (this.x + this.radius < canvas.width) && (this.x - this.radius > 0);
        if(!withinHorizontal) { this.setVx = -this.vx; }
        if(!withinVertical) { this.setVy = -this.vy; }
    }

    //Draws the particle onto the canvas
    render() {
        ctx.fillStyle = this.color.rgba();
        ctx.strokeStyle = this.lineColor.rgba();
        ctx.lineWidth = this.radius / 4;
        ctx.lineCap = "butt";
        ctx.beginPath();
        ctx.arc( this.x, this.y, this.radius, 0, 2 * pi, false );
        if( options.fill ) { ctx.fill() };
        if( options.outline ) { ctx.stroke() };
    }

    //Draws edges between particles within a vicinity, and also to the tracked mouse position
    renderEdges() {
        let index = particles.indexOf(this);
        if( options.mouseEdges ) {
            let a = this.x - mouse.cx;
            let b = this.y - mouse.cy;
            let distance = Math.hypot(a, b);
            if( mouse.inCanvas() && ( distance < 1.5 * options.vicinity ) ) {
                const alpha = 1 - ( distance / ( 1.5 * options.vicinity ) );
                ctx.lineCap = "round";
                ctx.strokeStyle = this.lineColor.rgba(alpha);
                ctx.lineWidth = Math.sqrt(this.radius) * Math.log( options.vicinity - distance * 1.5 + 1 );
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(mouse.cx, mouse.cy);
                ctx.stroke();
            }
        }

        if( options.edges ) {
            for ( let i = index -1; i >= 0; i-- ) {
                let p = particles[i];
                let a = this.x - p.x;
                let b = this.y - p.y;
                let distance = Math.hypot(a, b);
                
                if( distance < options.vicinity ) {
                    const alpha = options.opacity - ( distance / (options.vicinity / options.opacity) );
                    ctx.strokeStyle = ( Color.avgColors( [this.lineColor, p.lineColor] ) ).rgba(alpha);
                    ctx.lineCap = "round";
                    ctx.lineWidth = Math.sqrt(this.radius + p.radius) / 2 * Math.log( options.vicinity - distance + 1 );
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke()               
                }
            }
        }
    }
}