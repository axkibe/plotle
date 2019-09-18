/*
| A round section of a shape.
|
| Used by shape.
*/
'use strict';


tim.define( module, ( def, gleam_shape_round ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// if true do it counter-clockwise
		ccw : { type : [ 'undefined', 'boolean' ] },

		// true if this closes the shape
		close : { type : [ 'undefined', 'boolean' ] }
	};
}

const gleam_point = tim.require( '../point' );


/*
| Shortcut to create a round to close.
*/
def.staticLazy.close = ( ) =>
	gleam_shape_round.create( 'close', true );


/*
| Shortcut to create a count clockwise round to close.
*/
def.staticLazy.closeCcw = ( ) =>
	gleam_shape_round.create( 'ccw', true, 'close', true );


/*
| Shortcut to create a round to p.
*/
def.static.createP =
	( p ) =>
	gleam_shape_round.create( 'p', p );

/*
| Shortcut to create a counter clockwise round to p.
*/
def.static.createPCcw =
	( p ) =>
	gleam_shape_round.create( 'ccw', true, 'p', p );


/*
| Shortcut to create a round to xy.
*/
def.static.createXY =
	( x, y ) =>
	gleam_shape_round.create( 'p', gleam_point.createXY( x, y ) );


/*
| Gets the source of a projection to p.
|
| Returns the projection intersection in
| case it intersects with this sectioin
| or undefined otherwise
*/
def.proto.getProjection =
	function(
		p,   // point to project to
		pn,  // next point in shape( === this.p when not closing )
		pp,  // previous point in shape
		pc   // central point of shape
	)
{
	const dx = pn.x - pp.x;
	const dy = pn.y - pp.y;
	const dxy = dx * dy;
	let a, b;
	let cx, cy;

	if( dxy > 0 )
	{
		cx = pp.x;
		cy = pn.y;
		a  = Math.abs( pn.x - cx );
		b  = Math.abs( pp.y - cy );
	}
	else
	{
		cx = pn.x;
		cy = pp.y;
		a = Math.abs( pp.x - cx );
		b = Math.abs( pn.y - cy );
	}

	if(
		( p.x < cx || dy <= 0 ) && ( p.x > cx || dy >= 0 )
		|| ( p.y < cy || dx >= 0 ) && ( p.y > cy || dx <= 0 )
	) return;

	if( p.x === pc.x )
	{
		if( p.y > cy ) return gleam_point.createXY( cx, cy + b );
		else if( p.y < cy ) return gleam_point.createXY( cx, cy - b );
		else if( p.y === cy ) return gleam_point.createXY( cx, cy );
	}
	else
	{
		const k = ( p.y - pc.y ) / ( p.x - pc.x );
		const d = ( pc.y - cy ) - k * ( pc.x - cx );

		// x^2 / a^2 + y^2 / b^2 = 1
		// y = k * x + d
		// x^2 / a^2 + ( k * x + d )^2 / b^2 = 1
		// x^2 / a^2 + k^2 * x^2 / b^2 + 2 * k * x * d / b^2 + d^2 / b^2 = 1
		// x^2 ( 1 / a^2 + k^2 / b^2 ) + x ( 2 * k * d / b^2 ) + d^2 / b^2 - 1 = 0

		const qa = 1 / (a * a) + k * k / ( b * b );
		const qb = 2 * k * d / ( b * b );
		const qc = d * d / ( b * b ) - 1;
		let x, y;

		if ( p.x > cx )
		{
			x = ( -qb + Math.sqrt ( qb * qb - 4 * qa * qc ) ) / ( 2 * qa );
		}
		else
		{
			x = ( -qb - Math.sqrt ( qb * qb - 4 * qa * qc ) ) / ( 2 * qa );
		}
		// x = Math.sqrt(  1 / ( 1 / ( a * a ) + k * k / ( b * b ) ) );

		y = k * x + d;
		x += cx;
		y += cy;

		if(
			( ( y >= cy && p.y >= cy ) || ( y <= cy && p.y <= cy ) )
			&& ( ( x >= cx && p.x >= cx ) || ( x <= cx && p.x <= cx ) )
		) return gleam_point.createXY( x, y );
	}
};


} );
