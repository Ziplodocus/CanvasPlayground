// import {} from '';
//Getting the size of the canvas and assigning it to an object
export class ParticleCanvas extends HTMLCanvasElement {
	constructor() {
		super()
		this.widths = this.computedStyle( 'width' ).replace( 'px', '' )
		this.heights = this.computedStyle( 'height' ).replace( 'px', '' )
		this.bounds = this.getBoundingClientRect()
	}
	area() {
		return this.width * this.height
	}
	refresh() {
		this.widths = this.computedStyle( 'width' ).replace( 'px', '' );
		this.heights = this.computedStyle( 'height' ).replace( 'px', '' );
		this.bounds = this.getBoundingClientRect();
	}
}
customElements.define( 'particle-canvas', ParticleCanvas, { extends: 'canvas' } );