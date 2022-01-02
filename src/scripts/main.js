import { z, Z, zQuery } from '../modules/zQuery/z-query.js';
import 'particle-web-component';
zQuery.init( [ 'events' ] );
const canvas = z( 'canvas[is="particle-canvas"]' );
function changeOptions( event ) {
	const inputElement = event.currentTarget;
	const valName = inputElement.name;
	const value = inputElement.type == 'checkbox' ? !inputElement.checked : parseFloat( inputElement.value );
	canvas.options[ valName ] = value;
}
z( 'input[type="range"]' ).on( 'input', changeOptions );
Z( 'input[type="checkbox"]' ).on( 'input', changeOptions )
