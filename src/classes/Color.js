
export class Color {
  constructor( r = Color.randHex(), g = Color.randHex(), b = Color.randHex() ) {
    this._r = r;
    this._g = g;
    this._b = b;
  }
  //Are these getters and setters pointless? should setters be named differently?
  get r() { return this._r }
  get g() { return this._g }
  get b() { return this._b }
  get a() { return options.opacity }

  set r( re ) { this._r = re }
  set g( gr ) { this._g = gr }
  set b( bl ) { this._b = bl }
  set a( al ) { this._a.opacity = al }

  //returns the rgba version of the color, with a parameter option to manually set the opacity
  rgba( opacity = this.a ) { return `rgba(${this.r}, ${this.g}, ${this.b}, ${opacity})` }

  //returns a new color from the average values of an array of other colors,
  static avgColors( colorArr ) {
    const vals = { r: 0, g: 0, b: 0 };
    colorArr.forEach( color => {
      for ( let val in vals ) {
        vals[ val ] += color[ val ] ** 2;
      }
    } )
    for ( let val in vals ) {
      vals[ val ] = Math.sqrt( vals[ val ] / colorArr.length )
    }
    return new Color( vals.r, vals.g, vals.b );
  }

  static randHex() {
    return Math.round( Math.random() * 255 )
  }
}