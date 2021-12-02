import { Particle } from "./Particle.js";
import { randomAngle } from "../scripts/helpers.js";

export class ParticleManager {
  constructor( options ) {
    this.particles = []
    this.options = options
    // this.spaceDimensions = {
    //   x: ,
    //   y:
    // }

    // for ( let i = this.initialQuantity; i > 0; i-- ) {
    //   const randX = Math.random() * ( this.width - 2 * this.maxRadius ) * options.pixelDensity + options.maxRadius;
    //   const randY = Math.random() * ( options.height - 2 * options.maxRadius ) * options.pixelDensity + options.maxRadius;
    //   particles.push( new Particle( randX, randY, options.speed(), options.direction() ) );
    // }
  }
  randomSpeed() {
    const ops = this.options;
    return Math.random() * ( ops.maxSpeed - ops.minSpeed ) + ops.minSpeed;
  }
  add( x, y ) {
    this.particles.push( new Particle( x, y, this.randomSpeed(), randomAngle() ) );
  }
}