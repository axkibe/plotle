/*
| A geometric shape.
|
| Used by ellipse, roundRect
*/


var
	euclid_point,
	euclid_shape,
	swatch;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition
*/
if( JION )
{
	return {
		id : 'euclid_shape',
		attributes :
		{
			pc :
			{
				comment : 'center point',
				type : 'euclid_point'
			}
		},
		ray : require( '../typemaps/shapeSection' )
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_shape.prototype;


/*
| Gets the source of a projection to p.
|
| FIXME Move the section logic into shape sections
*/
prototype.getProjection =
	function(
		p
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
		pc,
		pi,
		pn,
		pp,
		pstart,
		qa,
		qb,
		qc,
		r,
		rZ,
		section,
		x,
		y;

	pc = this.pc;

/**/if( CHECK )
/**/{
/**/	if( this.get( 0 ).reflect !== 'euclid_shape_start' )
/**/	{
/**/		// must have start at [0]
/**/		throw new Error( );
/**/	}
/**/}

	pstart = this.get( 0 ).p;

	pp = pstart;

	for(
		r = 1, rZ = this.length;
		r < rZ;
		r++
	)
	{
/**/	if( CHECK )
/**/	{
/**/		if( !pstart )
/**/		{
/**/			// closed prematurely
/**/			throw new Error( );
/**/		}
/**/	}

		section = this.get( r );

		if( section.close )
		{
			pn = pstart;

			pstart = undefined;
		}
		else
		{
			pn = section.p;
		}

		switch( section.reflect )
		{
			case 'euclid_shape_line' :
			case 'euclid_shape_flyLine' :

				pi = section.getProjection( p, pn, pp, pc );

				if( pi ) return pi;

				break;

			case 'euclid_shape_round' :

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
					break;
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

					d = (pc.y - cy) - k * (pc.x - cx);

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

				break;

			default :

				// unknown section.
				throw new Error( );
		}

		pp = pn;
	}

	console.log( 'no section created a projection.' );

	return pc;

	// no section created a projection.
	//throw new Error( );
};

/*
| Returns the shape repositioned for 'view'.
*/
prototype.inView =
	function(
		view
	)
{
	var
		a, aZ,
		ray;

	ray = [ ];

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		ray[ a ] = this.get( a ).inView( view );
	}

	return this.create( 'ray:init', ray );
};


/*
| Returns true if point is within the shape.
*/
prototype.within =
	function(
		p
	)
{
	return swatch.withinSketch( this, p );
};


})( );
