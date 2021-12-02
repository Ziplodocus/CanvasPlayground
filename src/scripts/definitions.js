
const pi = Math.PI;

const particles = [];

//Restraints on particle properties
const options = {
	opacity: 1,
	mouseEdges: true,
	edges: true,
	fill: true,
	outline: true,
	resolutionModifier: 2,

	minSpeed: 0.1,
	maxSpeed: 2,
	minRadius: 5,
	maxRadius: 10,
	vicinity: 150,
	initialParticles: 50,


	speed() {
		return Math.random() * ( this.maxSpeed - this.minSpeed ) + this.minSpeed;
	},

	direction() { return Math.random() * 2 * pi }
}

//Object to track position of the mouse and determine whether it is in the canvas.


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


export { particles, options };