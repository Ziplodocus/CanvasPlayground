import { z, Z, zQuery } from '../../modules/zQuery/z-query';
import { particleManager } from './'
zQuery.init( [ 'events' ] )
//Getting the size of the this and assigning it to an object
export class ParticleCanvas extends HTMLCanvasElement {
	constructor() {
		super()
		this.width = this.computedStyle( 'width' ).replace( 'px', '' )
		this.height = this.computedStyle( 'height' ).replace( 'px', '' )
		this.bounds = this.getBoundingClientRect()
		this.pixelDensity = this.getAttribute()
		this.particleManager = new particleManager()
		this.on( 'resize', this.createResizeHandler(), { 'passive': true } );
	}
	area() {
		return this.width * this.height
	}
	refresh() {
		this.width = this.computedStyle( 'width' ).replace( 'px', '' );
		this.height = this.computedStyle( 'height' ).replace( 'px', '' );
		this.bounds = this.getBoundingClientRect();
	}
	resize() {
		const oldCanvasSize = { width: this.width, height: this.height };
		this.refresh();

		const sizeRatio = this.width / oldCanvasSize.width;
		options.vicinity *= sizeRatio ** 0.5;

		particles.forEach( particle => {
			particle.x = particle.x * ( this.width / oldCanvasSize.width );
			particle.y = particle.y * ( this.height / oldCanvasSize.height );
		} )
		this.height = Math.floor( options.resolutionModifier * this.height );
		this.width = Math.floor( options.resolutionModifier * this.width );
	}

	createResizeHandler() {
		let resizeId;
		return () => {
			clearTimeout( resizeId );
			resizeId = setTimeout( this.resizeCanvas, 300 );
		}
	}
}
window.customElements.define( 'particle-this', ParticleCanvas, { extends: 'canvas' } );