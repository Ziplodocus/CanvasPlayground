import { z, Z, zQuery } from '../../modules/zQuery/z-query';
import { ParticleManager } from './ParticleManager';
import { pi } from '../scripts/helpers';
zQuery.init( [ 'events' ] );

//Getting the size of the this and assigning it to an object
export class ParticleCanvas extends HTMLCanvasElement {
	constructor() {
		super()
		this.width = this.computedStyle( 'width' ).replace( 'px', '' )
		this.height = this.computedStyle( 'height' ).replace( 'px', '' )
		this.bounds = this.getBoundingClientRect()
		this.ctx = this.getContext( '2d' )
		this.options = JSON.parse( this.getAttribute( 'data-options' ) )
		const particleOptions = JSON.parse( this.getAttribute( 'data-particle-options' ) )
		this.particleManager = new ParticleManager( particleOptions, this.width, this.height )

		this.on( 'optionChange', this.handleOptionChange )
		this.on( 'resize', this.createResizeHandler(), { 'passive': true } )
		this.on( 'mousemove', this.createHoverHandler() )
		this.on( 'click', e => {
			this.particleManager.add( e.offsetX, e.offsetY )
		} )

		const renderLoop = () => {
			this.particleManager.events.trigger( 'nextFrame' );
			this.renderParticles();
			requestAnimationFrame( renderLoop )
		}
		renderLoop()
	}
	area() {
		return this.width * this.height
	}
	refresh() {
		this.width = this.computedStyle( 'width' ).replace( 'px', '' ) * ( this.options.pixelDensity || 1 );
		this.height = this.computedStyle( 'height' ).replace( 'px', '' ) * ( this.options.pixelDensity || 1 );
		this.bounds = this.getBoundingClientRect();
	}
	resize() {
		console.log( 'triggered' );
		const oldCanvasSize = { width: this.width, height: this.height };
		this.refresh();

		const sizeRatio = this.width / oldCanvasSize.width;
		options.vicinity *= sizeRatio ** 0.5;

		this.particleManager.particles.forEach( particle => {
			particle.x = particle.x * ( this.width / oldCanvasSize.width );
			particle.y = particle.y * ( this.height / oldCanvasSize.height );
		} )

		this.height = Math.floor( options.resolutionModifier * this.height );
		this.width = Math.floor( options.resolutionModifier * this.width );
	}

	createResizeHandler() {
		let resizeId;
		return () => {
			console.log( 'resize' );
			clearTimeout( resizeId );
			resizeId = setTimeout( this.resizeCanvas, 300 );
		}
	}
	createHoverHandler( options ) {
		return event => {

		}
	}
	handleOptionChange() {

	}
	setUpParticleRenderer( options ) {

	}
	renderParticles() {
		const ctx = this.ctx;
		const opn = this.options;
		ctx.clearRect( 0, 0, this.width, this.height );
		ctx.lineCap = "butt";
		ctx.fillStyle = opn?.fillColor;
		ctx.strokeStyle = opn?.outlineColor;
		this.particleManager.particles.forEach( p => {
			if ( opn.fill || opn.outline ) {
				ctx.beginPath();
				ctx.arc( p.x, p.y, p.radius, 0, 2 * pi );
			}
			if ( opn.fill ) {
				if ( !opn.fillColor ) ctx.fillStyle = p.color.rgba;
				ctx.fill();
			}
			if ( opn.outline ) {
				ctx.strokeStyle = opn?.outlineColor || p.lineColor.rgba;
				ctx.lineWidth = p.radius / 3;
				ctx.stroke();
			}
		} )
	}
}
window.customElements.define( 'particle-canvas', ParticleCanvas, { extends: 'canvas' } );