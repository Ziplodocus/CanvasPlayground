import { Particle } from "./Particle.js";
import { randomAngle } from "../scripts/helpers.js";
import { EventEmitter } from "./EventEmitter.js";

export class ParticleManager extends EventEmitter {
  constructor( options, height, width ) {
    super()
    this.particles = []
    this.options = options
    this.bounds = { x: width, y: height }
    // this.spaceDimensions = {
    //   x: ,
    //   y:
    // }

    // for ( let i = this.initialQuantity; i > 0; i-- ) {
    //   const randX = Math.random() * ( this.width - 2 * this.maxRadius ) * options.pixelDensity + options.maxRadius;
    //   const randY = Math.random() * ( options.height - 2 * options.maxRadius ) * options.pixelDensity + options.maxRadius;
    //   particles.push( new Particle( randX, randY, options.speed(), options.direction() ) );
    // }
    this.events = new EventEmitter();
    this.onNextFrame = () => {
      this.particles.forEach( p => {
        p.events.trigger( 'move' );
        this.checkForBoundsCollision( p );
      } )
    }
    this.events.on( 'nextFrame', this.onNextFrame )
  }
  checkForBoundsCollision( p ) {
    if ( p.x - p.radius <= 0 || p.x + p.radius >= this.bounds.x ) {
      p.events.trigger( 'boundsCollide', {
        details: {
          horizontal: true
        }
      } )
    }
    if ( p.y - p.radius <= 0 || p.y + p.radius >= this.bounds.y ) {
      p.events.trigger( 'boundsCollide', {
        details: {
          vertical: true
        }
      } )
    }
  }
  randomSpeed() {
    const ops = this.options;
    return Math.random() * ( ops.maxSpeed - ops.minSpeed ) + ops.minSpeed;
  }
  add( x, y ) {
    this.particles.push( new Particle( x, y, this.randomSpeed(), randomAngle() ) );
  }
}