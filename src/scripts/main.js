import { z, Z, zQuery } from '../../modules/zQuery/z-query.js';
import { particles, options } from './definitions.js';
import { Particle } from '../classes/Particle.js';
import { ParticleCanvas } from '../classes/ParticleCanvas.js';
zQuery.init( [ 'events' ] );

const canvas = z( '[is=particle-canvas]' );
const ctx = canvas.getContext( '2d' );

function nextFrame() {
	ctx.clearRect( 0, 0, canvas.width, canvas.height );
	particles.forEach( particle => {
		particle.move();
		particle.collide();
		particle.render();
		particle.renderEdges();
	} )
	requestAnimationFrame( nextFrame );
}

function changeOptions( event ) {
	const inputElement = event.currentTarget;
	const valName = inputElement.name;
	const value = inputElement.type == 'checkbox' ? !inputElement.checked : parseFloat( inputElement.value );
	options[ valName ] = value;
}
console.dir( z( '[is=particle-canvas]' ).options );
z( 'input[type="range"]' ).on( 'input', changeOptions );
Z( 'input[type="checkbox"]' ).on( 'input', changeOptions )
nextFrame();
