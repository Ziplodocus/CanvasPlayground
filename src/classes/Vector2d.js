
export class Vector2d {
  constructor( x, y ) {
    this.x = x;
    this.y = y;
  }
  get norm() {
    return Math.sqrt( this.x ** 2 + this.y ** 2 )
  }
  mult( scalar ) {
    return new Vector2d( this.x * scalar, this.y * scalar )
  }
  dot( a ) {
    return new Vector2d( this.x * b.x, + this.y * b.y )
  }
  static add( ...vtrs ) {
    vtrs.reduce( ( prev, next ) => {
      return new Vector2d( prev.x + next.x, prev.y + next.y )
    } )
  }
}