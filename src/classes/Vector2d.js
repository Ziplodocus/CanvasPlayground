
export class Vector2d {
  constructor( x, y ) {
    this.x = x;
    this.y = y;
  }
  get norm() {
    return Math.sqrt( this.x ** 2 + this.y ** 2 )
  }
  mult( scalar ) {
    this.x *= scalar;
    this.y *= scalar;
  }
  dot( a ) {
    return this.x * a.x, + this.y * a.y;
  }
  add( vtr ) {
    this.x += vtr.x;
    this.y += vtr.y;
  }
}