/*
| A round section of a shape.
|
| Used by shape.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_shape_round',
		attributes :
		{
			p :
			{
				comment : 'connect to',
				type : [ 'undefined', 'euclid_point' ]
			},
			ccw :
			{
				comment : 'if true do it counter-clockwise',
				type : [ 'undefined', 'boolean' ]
			},
			close :
			{
				comment : 'true if this closes the shape',
				type : [ 'undefined', 'boolean' ]
			}
		}
	};
}


var
	euclid_point,
	euclid_shape_round;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


prototype = euclid_shape_round.prototype;


/*
| Returns the shape section repositioned to a view.
*/
prototype.inView =
	function(
		view
	)
{
	return(
		this.p !== undefined
		? this.create( 'p', this.p.inView( view ) )
		: this
	);
};


/*
| Returns a transformed shape section.
*/
prototype.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.reflect !== 'euclid_transform' ) throw new Error( );
/**/}

	return(
		this.p !== undefined
		? this.create( 'p', this.p.transform( transform ) )
		: this
	);
};


/*
| Gets the source of a projection to p.
|
| Returns the projection intersection in
| case it intersects with this sectioin
| or undefined otherwise
*/
prototype.getProjection =
	function(
		p,   // point to project to
		pn,  // next point in shape( === this.p when not closing )
		pp,  // previous point in shape
		pc   // central point of shape
	)
{
	var
		a,
		b,
		cx,
		cy,
		d,
		dx,
		dy,
		dxy,
		k,
		qa,
		qb,
		qc,
		x,
		y;

	dx = pn.x - pp.x;

	dy = pn.y - pp.y;

	dxy = dx * dy;

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
		||
		( p.y < cy || dx >= 0 ) && ( p.y > cy || dx <= 0 )
	)
	{
		return;
	}

	if( p.x === pc.x )
	{
		if( p.y > cy )
		{
			return euclid_point.create( 'x', cx, 'y', cy + b );
		}
		else if( p.y < cy )
		{
			return euclid_point.create( 'x', cx, 'y', cy - b );
		}
		else if( p.y === cy )
		{
			return euclid_point.create( 'x', cx, 'y', cy );
		}
	}
	else
	{
		k = ( p.y - pc.y ) / ( p.x - pc.x );

		d = ( pc.y - cy ) - k * ( pc.x - cx );

		// x^2 / a^2 + y^2 / b^2 = 1
		// y = k * x + d
		// x^2 / a^2 + ( k * x + d )^2 / b^2 = 1
		// x^2 / a^2 + k^2 * x^2 / b^2 + 2 * k * x * d / b^2 + d^2 / b^2 = 1
		// x^2 ( 1 / a^2 + k^2 / b^2 ) + x ( 2 * k * d / b^2 ) + d^2 / b^2 - 1 = 0

		qa = 1 / (a * a) + k * k / ( b * b );

		qb = 2 * k * d / ( b * b );

		qc = d * d / ( b * b ) - 1;

		if ( p.x > cx )
		{
			x =
				( -qb + Math.sqrt ( qb * qb - 4 * qa * qc ) )
				/
				( 2 * qa );
		}
		else
		{
			x =
				( -qb - Math.sqrt ( qb * qb - 4 * qa * qc ) )
				/
				( 2 * qa );
		}
		// x =
		//      Math.sqrt(
		//         1 / ( 1 / ( a * a ) + k * k / ( b * b ) )
		//      );

		y = k * x + d;

		x += cx;

		y += cy;

		if(
			(
				( y >= cy && p.y >= cy ) || ( y <= cy && p.y <= cy )
			)
			&&
			(
				( x >= cx && p.x >= cx ) || ( x <= cx && p.x <= cx )
			)
		)
		{
			return euclid_point.create( 'x', x, 'y', y );
		}
	}
};


})( );
