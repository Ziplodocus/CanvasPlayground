import { z, Z, zQuery } from '../../modules/zQuery/z-query';
import { ParticleManager } from './ParticleManager';
import { pi } from '../scripts/helpers';
import { Color } from './Color.js';
zQuery.init( [ 'events' ] );

//Getting the size of the this and assigning it to an object
export class ParticleCanvas extends HTMLCanvasElement {
	constructor() {
		super()
		// set up defaults all of them!!!
		const defaultOptions = {
			opacity: 0.5,
			edgeOpacity: 1,
			mouseEdge: true,
			fill: true,
			outline: false,
			edges: true,
			pixelDensity: 2
		}
		this.width = this.computedStyle( 'width' ).replace( 'px', '' )
		this.height = this.computedStyle( 'height' ).replace( 'px', '' )
		this.bounds = this.getBoundingClientRect()
		this.ctx = this.getContext( '2d' )
		this.ctx.lineCap = "butt";
		const canvasOptions = JSON.parse( this.getAttribute( 'data-canvas-options' ) );
		const particleOptions = JSON.parse( this.getAttribute( 'data-particle-options' ) )
		this.options = { ...defaultOptions, ...canvasOptions };
		this.particleManager = new ParticleManager( particleOptions, this.width, this.height )

		this.on( 'optionChange', this.handleOptionChange )
		this.on( 'resize', this.createResizeHandler(), { 'passive': true } )
		this.on( 'mousemove', this.createHoverHandler() )
		this.on( 'click', e => {
			this.particleManager.add( e.offsetX, e.offsetY )
		} )
		const handleInVicinity = e => {
			if ( this.options.edges ) this.renderEdge( e.p, e.q );
		}
		this.particleManager.on( 'inVicinity', handleInVicinity )

		const renderLoop = () => {
			this.setUpParticleRendering();
			this.particleManager.particles.forEach( p => {
				this.particleManager.trigger( 'incrementTime', { details: p } )
			} )
			this.particleManager.particles.forEach( p => {
				this.renderParticle( p );
			} )
			requestAnimationFrame( renderLoop )
		}
		renderLoop()
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
	setUpParticleRendering() {
		const ctx = this.ctx;
		ctx.clearRect( 0, 0, this.width, this.height );
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
	renderParticle( p ) {
		const ctx = this.ctx;
		const opn = this.options;
		if ( opn.fill || opn.outline ) {
			ctx.beginPath();
			ctx.arc( p.x, p.y, p.radius, 0, 2 * pi );
		}
		if ( opn.fill ) {
			ctx.fillStyle = opn.fillColor || p.color.rgba;
			ctx.fill();
		}
		if ( opn.outline ) {
			ctx.strokeStyle = opn.outlineColor || p.lineColor.rgba;
			ctx.lineWidth = p.radius / 3;
			ctx.stroke();
		}
	}
	//Draws edges between particles within a vicinity, and also to the tracked mouse position
	renderEdge( p, q ) {
		const ctx = this.ctx;
		const diff = p.position.minus( q.position );
		const distance = diff.norm;
		const alpha = this.options.edgeOpacity - ( distance / ( this.particleManager.options.vicinity / this.options.edgeOpacity ) );
		const radii = p.radius + q.radius;
		let edgeColor = '';
		switch ( true ) {
			case ( this.options.outlineColor ):
				edgeColor = this.options.outlineColor;
				break
			case ( this.options.outline ):
				edgeColor = Color.avgColors( [ p.lineColor, q.lineColor ] ).rgba;
				break
			case ( this.options.fillColor ):
				edgeColor = this.options.fillColor;
				break
			default:
				edgeColor = Color.avgColors( [ p.color, q.color ] ).rgba;
		}
		ctx.strokeStyle = edgeColor;
		ctx.globalAlpha = alpha;
		ctx.lineWidth = radii / 5;
		ctx.beginPath();
		ctx.moveTo( p.x, p.y );
		ctx.lineTo( q.x, q.y );
		ctx.stroke()
		ctx.globalAlpha = 1;
	}
	// if ( options.mouseEdges ) {
	// 	if ( !mouse.inCanvas() ) return;

	// 	const xDiff = this.x - mouse.cx;
	// 	if ( xDiff > options.vicinity * 1.5 ) return;

	// 	const yDiff = this.y - mouse.cy;
	// 	if ( yDiff > options.vicinity * 1.5 ) return;

	// 	const distance = vtr.norm( [ xDiff, yDiff ] );
	// 	if ( distance < 1.5 * options.vicinity ) {
	// 		const alpha = 1 - ( distance / ( 1.5 * options.vicinity ) );
	// 		ctx.strokeStyle = this.lineColor.rgba( alpha );
	// 		ctx.lineWidth = this.radius / 2;
	// 		ctx.beginPath();
	// 		ctx.moveTo( this.x, this.y );
	// 		ctx.lineTo( mouse.cx, mouse.cy );
	// 		ctx.stroke();
	// 	}
	// }
}
window.customElements.define( 'particle-canvas', ParticleCanvas, { extends: 'canvas' } );