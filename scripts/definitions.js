
const pi = Math.PI;

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let boundary = canvas.getBoundingClientRect();

const particles = [];

//Multiplier to make the canvas higher resolution, helps with sharpness
const resolutionModifier = 2;

//Restraints on particle properties
const options = {
    opacity: 0.1,
    mouseEdges: true,
    edges: true,
    fill: true,
    outline: true,
    minSpeed: 0.1,
    maxSpeed: 1,
    minRadius: 3,
    maxRadius: 8,
    vicinity: 100,
    initialParticles: 40,

    speed() {
        return Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    },

    direction() { return Math.random() * 2 * pi }
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
    },
    move(event) {
        boundary = canvas.getBoundingClientRect();
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.cx = (event.clientX - boundary.left) * resolutionModifier;
        mouse.cy = (event.clientY - boundary.top) * resolutionModifier;
    },
    reset(event) {
        mouse.x = 0;
        mouse.y = 0;
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
        const sumOfSquares = array.reduce((accrue, current, i) => {
            accrue += current**2;
            return accrue;
        }, 0)
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
        this._vx = speed * Math.cos( directionRadeons );
        this._vy = speed * Math.sin( directionRadeons );
        this._color = new Color();
        this._lineColor = new Color();
        this._radius = options.minRadius + ( options.maxRadius - options.minRadius ) * ( (speed - options.minSpeed) / (options.maxSpeed - options.minSpeed + 0.000001) );
    }

    get x() { return this._x }
    get y() { return this._y }
    get vx() { return this._vx }
    get vy() { return this._vy }
    get color() { return this._color }
    get lineColor() { return this._lineColor }
    get radius() { return this._radius }
    
    get speed() { return vtr.norm([this.vx, this.vy]) }
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

    //Handles collisions between particles and the container
    collide() {
        for ( let i = particles.indexOf(this) + 1; i < particles.length; i++ ) {
            const p = particles[i];

            const xDiff = this.x - p.x;
            const yDiff = this.y - p.y;
            const perpendicular = [xDiff, yDiff];
            const distance = vtr.norm(perpendicular);
            const radii = this.radius + p.radius;

            const perpunit = vtr.mult(perpendicular, 1 / vtr.norm(perpendicular));
            const tangunit = [-perpunit[1], perpunit[0]];

            const isCollision = (distance <= radii);
            const isOverlap = (distance < radii);

            //Shifts particles to the point of minimal (not zero!) contact if they are overlapped
            if ( isOverlap ) {
                const perpangle = Math.atan2(perpunit[1], perpunit[0]);
                const diff = radii - distance;
                let ratio;
                let xadj;
                let yadj;
                
                ratio = this.radius / radii;
                xadj = ratio * diff * Math.cos(perpangle);
                yadj = ratio * diff * Math.sin(perpangle);
                this.setX = this.x + xadj;
                this.setY = this.y + yadj;

                ratio = 1 - ratio;
                xadj = ratio * diff * Math.cos(perpangle + pi);
                yadj = ratio * diff * Math.sin(perpangle + pi);
                p.setX = p.x + xadj;
                p.setY = p.y + yadj;
            }

            //Handles if this particle collides with another, redirecting both
            if( isCollision ) {
                //u1 is the initial velocity of this particle and u2 the initial velocity of the colliding particle
                const u1 = [this.vx, this.vy];
                const u2 = [p.vx, p.vy];

                //Projection of initial velocity along the perpendicular and tangent direction of the point of contact
                const u1perp = vtr.dot(u1, perpunit);
                const u1tang= vtr.dot(u1, tangunit);
                const u2perp = vtr.dot(u2, perpunit);
                const u2tang = vtr.dot(u2, tangunit);

                /* 
                    New velocity in the direction of the perpendicular 
                    The velocity tangent to the point of collision does not change,
                    but the perpendicular does, hence turning the 2dimensional problem 
                    into a 1dimensional, (1 dimensional collision equation)
                */
                let v1perp = ( u1perp * (this.mass - p.mass) + 2 * p.mass * u2perp ) / (this.mass + p.mass) 
                let v2perp = ( u2perp * (p.mass - this.mass) + 2 * this.mass * u1perp ) / (this.mass + p.mass) 

                //Projecting the perp and tang velocities back onto cartesian coordinates
                let v1x = vtr.dot( vtr.mult(perpunit, v1perp), [1,0]) + vtr.dot( vtr.mult(tangunit, u1tang), [1,0]);
                let v1y = vtr.dot( vtr.mult(perpunit, v1perp), [0,1]) + vtr.dot( vtr.mult(tangunit, u1tang), [0,1]);
                let v2x = vtr.dot( vtr.mult(perpunit, v2perp), [1,0]) + vtr.dot( vtr.mult(tangunit, u2tang), [1,0]);
                let v2y = vtr.dot( vtr.mult(perpunit, v2perp), [0,1]) + vtr.dot( vtr.mult(tangunit, u2tang), [0,1]);

                //Setting the new velocities on the particles
                [this.setVx, this.setVy, p.setVx, p.setVy] = [v1x, v1y, v2x, v2y];
            }
        }
        //Handles bouncing off of the container
        let exceedHorizontal = (this.x + this.radius > canvas.width) || (this.x - this.radius < 0);
        let exceedVertical = (this.y + this.radius > canvas.height) || (this.y - this.radius < 0);
        
        // Determines +ve or -ve adjustment based on which wall is touched
        if(exceedHorizontal) { 
            let adj = this.x - this.radius < 0 ? this.x - this.radius : this.x + this.radius - canvas.width;
            this.setX = this.x - adj;
            this.setVx = -this.vx; 
        }
        if(exceedVertical) { 
            let adj = this.y - this.radius < 0 ? this.y - this.radius : this.y + this.radius - canvas.height;
            this.setY = this.y - adj; 
            this.setVy = -this.vy; 
        }
    }

    //Draws the particle onto the canvas
    render() {
        ctx.beginPath();
        ctx.arc( this.x, this.y, this.radius, 0, 2 * pi, false );
        if( options.fill ) { ctx.fillStyle = this.color.rgba(); ctx.fill() };
        if( options.outline ) { 
            ctx.strokeStyle = this.lineColor.rgba();
            ctx.lineWidth = this.radius / 6;
            ctx.lineCap = "butt";
            ctx.stroke();
        }
    }

    //Draws edges between particles within a vicinity, and also to the tracked mouse position
    renderEdges() {
        ctx.lineCap = "round";
        if( options.edges ) {
            for ( let i = particles.indexOf(this) -1; i >= 0; i-- ) {
                let p = particles[i];
                let xDiff = this.x - p.x;
                if ( xDiff > options.vicinity ) { continue };

                let yDiff = this.y - p.y;
                if( yDiff > options.vicinity ) { continue };

                let distance = Math.hypot(xDiff, yDiff);
                if( distance < options.vicinity ) {
                    const alpha = options.opacity - ( distance / (options.vicinity / options.opacity) );
                    ctx.strokeStyle = ( Color.avgColors( [this.lineColor, p.lineColor] ) ).rgba(alpha);
                    let radii = this.radius + p.radius;
                    ctx.lineWidth = radii / 5;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke()               
                }
            }
        }

        if( options.mouseEdges ) {
            if ( !mouse.inCanvas() ) { return };

            let xDiff = this.x - mouse.cx;
            if ( xDiff > options.vicinity*1.5 ) { return };

            let yDiff = this.y - mouse.cy;
            if ( yDiff > options.vicinity*1.5 ) { return };

            let distance = Math.hypot(xDiff, yDiff);
            if( distance < 1.5 * options.vicinity ) {
                const alpha = 1 - ( distance / ( 1.5 * options.vicinity ) );
                ctx.strokeStyle = this.lineColor.rgba(alpha);
                ctx.lineWidth = this.radius / 2;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(mouse.cx, mouse.cy);
                ctx.stroke();
            }
        }
    }

    static initialize() {
        for (let i = options.initialParticles; i > 0; i--) {
            let randX = Math.random() * (canvasSize.width - 2*options.maxRadius) * resolutionModifier + options.maxRadius;
            let randY = Math.random() * (canvasSize.height - 2*options.maxRadius) * resolutionModifier + options.maxRadius;
            particles.push(new Particle(randX, randY, options.speed(), options.direction()));
        }
    }
}