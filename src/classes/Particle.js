import { options } from '../scripts/definitions';
import { Color } from './Color';
import { pi } from '../scripts/helpers';
import { Vector2d } from './Vector2d';

export class Particle {
	constructor( xPos, yPos, speed, directionRadeons ) {
		this.position = new Vector2d( xPos, yPos );
		console.log( speed, directionRadeons )
		this.velocity = new Vector2d(
			speed * Math.cos( directionRadeons ),
			speed * Math.sin( directionRadeons )
		)
		this.color = new Color();
		this.lineColor = new Color();
		this.radius = options.minRadius + ( options.maxRadius - options.minRadius ) * ( ( speed - options.minSpeed ) / ( options.maxSpeed - options.minSpeed + 0.000001 ) );
	}

	get x() { return this.position.x }
	get y() { return this.position.y }
	get vx() { return this.velocity.x }
	get vy() { return this.velocity.y }

	get speed() { return this.velocity.norm }
	get direction() { return Math.acos( this.vx / this.speed ) }
	get mass() { return 4 / 3 * pi * this.radius ** 3 }

	set x( xPos ) { this._x = xPos }
	set y( yPos ) { this._y = yPos }
	set vx( x_velocity ) { this._vx = x_velocity }
	set vy( y_velocity ) { this._vy = y_velocity }


	//Changes the x and y coordinates based on speed and the direction of the particle
	move() {
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;
	}

	//Handles collisions between different particles and the container
	collide() {
		// Tests for and handles collision between particles
		for ( let i = particles.indexOf( this ) + 1; i < particles.length; i++ ) {
			// If the particle is nowhere near, check next particle
			const p = particles[ i ];
			const radii = this.radius + p.radius;
			const xDiff = this.x - p.x;
			if ( xDiff > radii ) continue;
			const yDiff = this.y - p.y;
			if ( yDiff > radii ) continue;

			// Calculating further required values
			const perpendicular = [ xDiff, yDiff ];
			const distance = vtr.norm( perpendicular );
			const isCollision = ( distance <= radii );
			const isOverlap = ( distance < radii );

			// Calculate unit vectors only if required
			const perpunit = isCollision && vtr.mult( perpendicular, 1 / vtr.norm( perpendicular ) );
			const tangunit = isCollision && [ -perpunit[ 1 ], perpunit[ 0 ] ];


			//Shifts particles to the point of minimal (not zero!) contact if they are overlapped
			if ( isOverlap ) {
				const diff = radii - distance;
				const xd = vtr.dot( perpendicular, [ 1, 0 ] ) / vtr.norm( perpendicular );
				const yd = vtr.dot( perpendicular, [ 0, 1 ] ) / vtr.norm( perpendicular );

				let ratio;
				let xadj;
				let yadj;

				ratio = this.radius / radii;
				xadj = ratio * diff * xd;
				yadj = ratio * diff * yd;
				this.x += xadj;
				this.y += yadj;

				ratio = 1 - ratio;
				xadj = ratio * diff * xd;
				yadj = ratio * diff * yd;
				p.x -= xadj;
				p.y -= yadj;
			}

			//Handles if this particle collides with another, redirecting both
			if ( isCollision ) {
				//u1 is the initial velocity of this particle and u2 the initial velocity of the colliding particle
				const u1 = [ this.vx, this.vy ];
				const u2 = [ p.vx, p.vy ];

				//Projection of initial velocity along the perpendicular and tangent direction of the point of contact
				const u1perp = vtr.dot( u1, perpunit );
				const u1tang = vtr.dot( u1, tangunit );
				const u2perp = vtr.dot( u2, perpunit );
				const u2tang = vtr.dot( u2, tangunit );

				/* 
								New velocity in the direction of the perpendicular 
								The velocity tangent to the point of collision does not change,
								but the perpendicular does, hence turning the 2dimensional problem 
								into a 1dimensional, (1 dimensional collision equation)
				*/
				const v1perp = ( u1perp * ( this.mass - p.mass ) + 2 * p.mass * u2perp ) / ( this.mass + p.mass )
				const v2perp = ( u2perp * ( p.mass - this.mass ) + 2 * this.mass * u1perp ) / ( this.mass + p.mass )

				//Projecting the perp and tang velocities back onto cartesian coordinates
				const v1x = vtr.dot( vtr.mult( perpunit, v1perp ), [ 1, 0 ] ) + vtr.dot( vtr.mult( tangunit, u1tang ), [ 1, 0 ] );
				const v1y = vtr.dot( vtr.mult( perpunit, v1perp ), [ 0, 1 ] ) + vtr.dot( vtr.mult( tangunit, u1tang ), [ 0, 1 ] );
				const v2x = vtr.dot( vtr.mult( perpunit, v2perp ), [ 1, 0 ] ) + vtr.dot( vtr.mult( tangunit, u2tang ), [ 1, 0 ] );
				const v2y = vtr.dot( vtr.mult( perpunit, v2perp ), [ 0, 1 ] ) + vtr.dot( vtr.mult( tangunit, u2tang ), [ 0, 1 ] );

				//Setting the new velocities on the particles
				[ this.vx, this.vy, p.vx, p.vy ] = [ v1x, v1y, v2x, v2y ];
			}
		}
		//Handles bouncing off of the container
		const exceedHorizontal = ( this.x + this.radius > canvas.width ) || ( this.x - this.radius < 0 );
		const exceedVertical = ( this.y + this.radius > canvas.height ) || ( this.y - this.radius < 0 );
		// Determines +ve or -ve adjustment based on which wall is touched
		if ( exceedHorizontal ) {
			const adj = this.x - this.radius < 0 ? this.x - this.radius : this.x + this.radius - canvas.width;
			this.x = this.x - adj;
			this.vx = -this.vx;
		}
		if ( exceedVertical ) {
			const adj = this.y - this.radius < 0 ? this.y - this.radius : this.y + this.radius - canvas.height;
			this.y = this.y - adj;
			this.vy = -this.vy;
		}
	}

	//Draws edges between particles within a vicinity, and also to the tracked mouse position
	renderEdges() {
		ctx.lineCap = "round";
		if ( options.edges ) {
			for ( let i = particles.indexOf( this ) + 1; i < particles.length; i++ ) {
				const p = particles[ i ];

				const xDiff = this.x - p.x;
				if ( xDiff > options.vicinity ) continue;
				const yDiff = this.y - p.y;
				if ( yDiff > options.vicinity ) continue;

				const distance = vtr.norm( [ xDiff, yDiff ] );
				if ( distance < options.vicinity ) {
					const alpha = options.opacity - ( distance / ( options.vicinity / options.opacity ) );
					ctx.strokeStyle = Color.avgColors( [ this.lineColor, p.lineColor ] ).rgba( alpha );
					const radii = this.radius + p.radius;
					ctx.lineWidth = radii / 5;
					ctx.beginPath();
					ctx.moveTo( this.x, this.y );
					ctx.lineTo( p.x, p.y );
					ctx.stroke()
				}
			}
		}

		if ( options.mouseEdges ) {
			if ( !mouse.inCanvas() ) return;

			const xDiff = this.x - mouse.cx;
			if ( xDiff > options.vicinity * 1.5 ) return;

			const yDiff = this.y - mouse.cy;
			if ( yDiff > options.vicinity * 1.5 ) return;

			const distance = vtr.norm( [ xDiff, yDiff ] );
			if ( distance < 1.5 * options.vicinity ) {
				const alpha = 1 - ( distance / ( 1.5 * options.vicinity ) );
				ctx.strokeStyle = this.lineColor.rgba( alpha );
				ctx.lineWidth = this.radius / 2;
				ctx.beginPath();
				ctx.moveTo( this.x, this.y );
				ctx.lineTo( mouse.cx, mouse.cy );
				ctx.stroke();
			}
		}
	}
}