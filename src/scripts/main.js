import { z, Z, zQuery } from '../../modules/zQuery/z-query.js';
import { options } from './definitions.js';
import { Particle } from '../classes/Particle.js';
import { ParticleCanvas } from '../classes/ParticleCanvas.js';
zQuery.init( [ 'events' ] );

const canvas = z( '[is=particle-canvas]' );
const ctx = canvas.getContext( '2d' );

function changeOptions( event ) {
	const inputElement = event.currentTarget;
	const valName = inputElement.name;
	const value = inputElement.type == 'checkbox' ? !inputElement.checked : parseFloat( inputElement.value );
	options[ valName ] = value;
}
z( 'input[type="range"]' ).on( 'input', changeOptions );
Z( 'input[type="checkbox"]' ).on( 'input', changeOptions )
