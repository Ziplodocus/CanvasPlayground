import { z, Z } from '../modules/zQuery/z-query.js';

const pi = Math.PI;
const canvas = z('#particles');
const ctx = canvas.getContext('2d');

const particles = [];

//Restraints on particle properties
const options = {
    opacity: 1,
    mouseEdges: true,
    edges: true,
    fill: true,
    outline: true,

    minSpeed: 0.1,
    maxSpeed: 2,
    minRadius: 5,
    maxRadius: 10,
    vicinity: 150,

    resolutionModifier: 2,
    initialParticles: 20,

    speed() {
        return Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    },

    direction() { return Math.random() * 2 * pi }
}

//Getting the size of the canvas and assigning it to an object
const canvasSize = {
    width: canvas.computedStyle('width').replace('px',''),
    height: canvas.computedStyle('height').replace('px',''),
    bounds: canvas.getBoundingClientRect(),
    area() {
        return this.width * this.height
    },
    refresh() {
        this.width = canvas.computedStyle('width').replace('px','');
        this.height = canvas.computedStyle('height').replace('px','');
        this.bounds = canvas.getBoundingClientRect();
    }
}

//Object to track position of the mouse and determine whether it is in the canvas.
const mouse = {
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
    inCanvas() {
        const inX = (this.x > canvasSize.bounds.left) && ((this.cx / options.resolutionModifier) + canvasSize.bounds.left < canvasSize.bounds.right) ? true : false;
        const inY = (this.y > canvasSize.bounds.top) && ((this.cy / options.resolutionModifier) + canvasSize.bounds.top < canvasSize.bounds.bottom) ? true : false;
        return inY && inX ? true : false;
    },
    move(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.cx = (event.clientX - canvasSize.bounds.left) * options.resolutionModifier;
        mouse.cy = (event.clientY - canvasSize.bounds.top) * options.resolutionModifier;
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
    mult(array, multi) { return array.map(val => val*multi) },
    add(arrayOfVectors) {
        const addedVtr = [];
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
    constructor( r=Color.randHex(), g=Color.randHex(), b=Color.randHex() ) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = options;
    }
    //Are these getters and setters pointless? should setters be named differently?
    get r() {return this._r}
    get g() {return this._g}
    get b() {return this._b}
    get a() {return this._a.opacity}

    set r(re) {this._r = re}
    set g(gr) {this._g = gr}
    set b(bl) {this._b = bl}
    set a(al) {this._a.opacity = al}

    //returns the rgba version of the color, with a parameter option to manually set the opacity
    rgba(opacity = this.a) {return `rgba(${this.r}, ${this.g}, ${this.b}, ${opacity})`}

    //returns a new color from the average values of an array of other colors,
    static avgColors(colorArr) {
        const vals = {r: 0, g: 0, b: 0};
        colorArr.forEach( color => {
            for (let val in vals) {
                vals[val] += color[val]**2;
            }
        })
        for (let val in vals) {
            vals[val] = Math.sqrt( vals[val] / colorArr.length )
        }
        return new Color(vals.r, vals.g, vals.b);
    }

    static randHex() {
        return Math.round( Math.random() * 255 )
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

    set x( xPos ) { this._x = xPos }
    set y( yPos ) { this._y = yPos }
    set vx( x_velocity ) { this._vx = x_velocity }
    set vy( y_velocity ) { this._vy = y_velocity }


    //Changes the x and y coordinates based on speed and the direction of the particle
    move() {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }

    //Handles collisions between different particles and the container
    collide() {
        // Tests for and handles collision between particles
        for ( let i = particles.indexOf(this) + 1; i < particles.length; i++ ) {
            // If the particle is nowhere near, check next particle
            const p = particles[i];
            const radii = this.radius + p.radius;
            const xDiff = this.x - p.x;
            if ( xDiff > radii ) continue;
            const yDiff = this.y - p.y;
            if ( yDiff > radii ) continue;

            // Calculating further required values
            const perpendicular = [xDiff, yDiff];
            const distance = vtr.norm(perpendicular);
            const isCollision = (distance <= radii);
            const isOverlap = (distance < radii);

            // Calculate unit vectors only if required
            const perpunit = isCollision && vtr.mult( perpendicular, 1 / vtr.norm(perpendicular) );
            const tangunit = isCollision && [-perpunit[1], perpunit[0]];


            //Shifts particles to the point of minimal (not zero!) contact if they are overlapped
            if ( isOverlap ) {
                const diff = radii - distance;
                const xd = vtr.dot( perpendicular, [1,0] ) / vtr.norm( perpendicular );
                const yd = vtr.dot( perpendicular, [0,1] ) / vtr.norm( perpendicular );
                
                let ratio;
                let xadj;
                let yadj;
                
                ratio = this.radius / radii;
                xadj = ratio * diff * xd;
                yadj = ratio * diff * yd;
                this.x += xadj;
                this.y += yadj;

                ratio = 1 - ratio;
                xadj = ratio * diff * xd;
                yadj = ratio * diff * yd;
                p.x -= xadj;
                p.y -= yadj;
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
                const v1perp = ( u1perp * (this.mass - p.mass) + 2 * p.mass * u2perp ) / (this.mass + p.mass) 
                const v2perp = ( u2perp * (p.mass - this.mass) + 2 * this.mass * u1perp ) / (this.mass + p.mass) 

                //Projecting the perp and tang velocities back onto cartesian coordinates
                const v1x = vtr.dot( vtr.mult(perpunit, v1perp), [1,0]) + vtr.dot( vtr.mult(tangunit, u1tang), [1,0]);
                const v1y = vtr.dot( vtr.mult(perpunit, v1perp), [0,1]) + vtr.dot( vtr.mult(tangunit, u1tang), [0,1]);
                const v2x = vtr.dot( vtr.mult(perpunit, v2perp), [1,0]) + vtr.dot( vtr.mult(tangunit, u2tang), [1,0]);
                const v2y = vtr.dot( vtr.mult(perpunit, v2perp), [0,1]) + vtr.dot( vtr.mult(tangunit, u2tang), [0,1]);

                //Setting the new velocities on the particles
                [this.vx, this.vy, p.vx, p.vy] = [v1x, v1y, v2x, v2y];
            }
        }
        //Handles bouncing off of the container
        const exceedHorizontal = (this.x + this.radius > canvas.width) || (this.x - this.radius < 0);
        const exceedVertical = (this.y + this.radius > canvas.height) || (this.y - this.radius < 0);
        // Determines +ve or -ve adjustment based on which wall is touched
        if(exceedHorizontal) { 
            const adj = this.x - this.radius < 0 ? this.x - this.radius : this.x + this.radius - canvas.width;
            this.x = this.x - adj;
            this.vx = -this.vx; 
        }
        if(exceedVertical) { 
            const adj = this.y - this.radius < 0 ? this.y - this.radius : this.y + this.radius - canvas.height;
            this.y = this.y - adj; 
            this.vy = -this.vy; 
        }
    }

    //Draws the particle onto the canvas
    render() {
        if ( options.fill || options.outline ) {
            ctx.beginPath();
            ctx.arc( this.x, this.y, this.radius, 0, 2 * pi );
        }
        if( options.fill ) { ctx.fillStyle = this.color.rgba(); ctx.fill() };
        if( options.outline ) { 
            ctx.strokeStyle = this.lineColor.rgba();
            ctx.lineWidth = this.radius / 3;
            ctx.lineCap = "butt";
            ctx.stroke();
        }
    }

    //Draws edges between particles within a vicinity, and also to the tracked mouse position
    renderEdges() {
        ctx.lineCap = "round";
        if( options.edges ) {
            for ( let i = particles.indexOf(this) + 1; i < particles.length; i++ ) {
                const p = particles[i];

                const xDiff = this.x - p.x;
                if ( xDiff > options.vicinity ) continue;
                const yDiff = this.y - p.y;
                if( yDiff > options.vicinity ) continue;

                const distance = vtr.norm([xDiff, yDiff]);
                if( distance < options.vicinity ) {
                    const alpha = options.opacity - ( distance / (options.vicinity / options.opacity) );
                    ctx.strokeStyle = Color.avgColors( [this.lineColor, p.lineColor] ).rgba(alpha);
                    const radii = this.radius + p.radius;
                    ctx.lineWidth = radii / 5;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke()               
                }
            }
        }

        if( options.mouseEdges ) {
            if ( !mouse.inCanvas() ) return;

            const xDiff = this.x - mouse.cx;
            if ( xDiff > options.vicinity*1.5 ) return;

            const yDiff = this.y - mouse.cy;
            if ( yDiff > options.vicinity*1.5 ) return;

            const distance = vtr.norm([xDiff, yDiff]);
            if ( distance < 1.5 * options.vicinity ) {
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
            const randX = Math.random() * (canvasSize.width - 2*options.maxRadius) * options.resolutionModifier + options.maxRadius;
            const randY = Math.random() * (canvasSize.height - 2*options.maxRadius) * options.resolutionModifier + options.maxRadius;
            particles.push( new Particle( randX, randY, options.speed(), options.direction() ) );
        }
    }

    static applySettings() {
        return
    }
}

export { particles, options, canvas, mouse, vtr, ctx, Color, Particle, canvasSize };