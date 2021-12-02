
const pi = Math.PI;

const particles = [];

//Restraints on particle properties
const options = {
	opacity: 1,
	mouseEdges: true,
	edges: true,
	fill: true,
	outline: true,

	minSpeed: 0.1,
	maxSpeed: 2,
	minRadius: 5,
	maxRadius: 10,
	vicinity: 150,

	resolutionModifier: 2,
	initialParticles: 50,

	speed() {
		return Math.random() * ( this.maxSpeed - this.minSpeed ) + this.minSpeed;
	},

	direction() { return Math.random() * 2 * pi }
}

//Object to track position of the mouse and determine whether it is in the canvas.
const mouse = {
	x: 0,
	y: 0,
	cx: 0,
	cy: 0,
	inCanvas() {
		const inX = ( this.x > canvasSize.bounds.left ) && ( ( this.cx / options.resolutionModifier ) + canvasSize.bounds.left < canvasSize.bounds.right ) ? true : false;
		const inY = ( this.y > canvasSize.bounds.top ) && ( ( this.cy / options.resolutionModifier ) + canvasSize.bounds.top < canvasSize.bounds.bottom ) ? true : false;
		return inY && inX ? true : false;
	},
	move( event ) {
		mouse.x = event.clientX;
		mouse.y = event.clientY;
		mouse.cx = ( event.clientX - canvasSize.bounds.left ) * options.resolutionModifier;
		mouse.cy = ( event.clientY - canvasSize.bounds.top ) * options.resolutionModifier;
	},
	reset( event ) {
		mouse.x = 0;
		mouse.y = 0;
	}
};


// const vtr = {
// 	dot( a, b ) {
// 		const result = a.reduce( ( acc, cur, i ) => {
// 			acc += cur * b[ i ];
// 			return acc;
// 		}, 0 );
// 		return result;
// 	},
// 	norm( array ) {
// 		const sumOfSquares = array.reduce( ( accrue, current, i ) => {
// 			accrue += current ** 2;
// 			return accrue;
// 		}, 0 )
// 		return Math.sqrt( sumOfSquares );
// 	},
// 	mult( array, multi ) { return array.map( val => val * multi ) },
// 	add( arrayOfVectors ) {
// 		const addedVtr = [];
// 		let sum;
// 		for ( let i = 0; i < arrayOfVectors[ 0 ].length; i++ ) {
// 			sum = 0;
// 			for ( let j = 0; j < arrayOfVectors.length; j++ ) {
// 				sum += arrayOfVectors[ j ][ i ]
// 			}
// 			addedVtr.push( sum );
// 		}
// 		return addedVtr;
// 	}
// }


export { particles, options, mouse };