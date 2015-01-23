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
		id :
			'euclid_shape',
		attributes :
			{
				hull :
					{
						comment :
							'hull definition',
						type :
							'Array'
					},
				pc :
					{
						comment :
							'center point',
						type :
							'euclid_point'
					}
			},

		equals :
			'primitive'
	};
}


/*
| Gets the source of a projection to p.
*/
euclid_shape.prototype.getProjection =
	function(
		p
	)
{
	var
		a,
		b,
		cx,
		cy,
		det,
		dx,
		dy,
		dxy,
		h,
		hull,
		hZ,
		la1,
		lb1,
		lc1,
		la2,
		lb2,
		lc2,
		pc,
		pix,
		piy,
		pn,
		pp,
		pstart,
		y;

	hull = this.hull;

	h = 1;

	hZ = hull.length;

	pc = this.pc;

/**/if( CHECK )
/**/{
/**/	if( hull[ 0 ] !== 'start' )
/**/	{
/**/		// hull must have start at [0]
/**/		throw new Error( );
/**/	}
/**/}

	pstart = hull [ h++ ];

	pp = pstart;

	pn = null;

	while( h < hZ )
	{
/**/	if( CHECK )
/**/	{
/**/		if( !pstart )
/**/		{
/**/			// hull closed prematurely
/**/			throw new Error( );
/**/		}
/**/	}

		switch( hull[ h ] )
		{

			case 'bezier' :

				pn = hull[ h + 5 ];

				break;

			case 'line' :
			case '0-line' :

				pn = hull[ h + 1 ];

				break;

			case 'round' :

				pn = hull[ h + 2 ];

				break;

			default :

				// unknown hull section
				throw new Error( );
		}

		if( pn === 'close' )
		{
			pn = pstart;

			pstart = null;
		}

		switch( hull[h] )
		{

			case 'bezier' :

/**/			if( CHECK )
/**/			{
/**/				// cannot yet do projections for beziers.
/**/				throw new Error( );
/**/			}

				break;

			case 'line' :
			case '0-line' :

				la1 = p.y - pc.y;

				lb1 = pc.x -  p.x;

				lc1 = la1 * pc.x + lb1 * pc.y;

				la2 = pn.y - pp.y;

				lb2 = pp.x - pn.x;

				lc2 = la2 * pp.x + lb2 * pp.y;

				det = la1 * lb2 - la2 * lb1;

				if( det !== 0 )
				{
					pix = ( lb2 * lc1 - lb1 * lc2 ) / det;

					piy = ( la1 * lc2 - la2 * lc1 ) / det;

					if(
						Math.min( pp.x, pn.x ) <= pix &&
						Math.max( pp.x, pn.x ) >= pix &&
						Math.min( pp.y, pn.y ) <= piy &&
						Math.max( pp.y, pn.y ) >= piy &&

						Math.min( pc.x, p.x  ) <= pix &&
						Math.max( pc.x, p.x  ) >= pix &&
						Math.min( pc.y, p.y  ) <= piy &&
						Math.max( pc.y, p.y  ) >= piy
					)
					{
						return(
							euclid_point.create(
								'x', pix,
								'y', piy
							)
						);
					}
				}

				h += 2;

				break;

			case 'round' :

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
					(
						( p.x < cx || dy <= 0 ) && ( p.x > cx || dy >= 0 )
					)
					||
					(
						( p.y < cy || dx >= 0 ) && ( p.y > cy || dx <= 0 )
					)
				)
				{
					h += 3;

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
					var
						k =
							( p.y - pc.y ) / ( p.x - pc.x ),

						d =
							(pc.y - cy) - k * (pc.x - cx),

					// x^2 / a^2 + y^2 / b^2 = 1
					// y = k * x + d
					// x^2 / a^2 + ( k * x + d )^2 / b^2 = 1
					// x^2 / a^2 + k^2 * x^2 / b^2 + 2 * k * x * d / b^2 + d^2 / b^2 = 1
					// x^2 ( 1 / a^2 + k^2 / b^2 ) + x ( 2 * k * d / b^2 ) + d^2 / b^2 - 1 = 0

						qa =
							1 / (a * a) + k * k / ( b * b ),

						qb =
							2 * k * d / ( b * b ),

						qc =
							d * d / ( b * b ) - 1,

						x;

					if ( p.x > cx )
					{
						x =
							( -qb + Math.sqrt ( qb * qb - 4 * qa * qc ) ) / ( 2 * qa );
					}
					else
					{
						x =
							( -qb - Math.sqrt ( qb * qb - 4 * qa * qc ) ) / ( 2 * qa );
					}
					// var x = Math.sqrt( 1 / ( 1 / ( a * a ) + k * k / ( b * b ) ) );

					y = k * x + d;

					x += cx;

					y += cy;

					if(
						(
							( y >= cy && p.y >= cy ) ||
							( y <= cy && p.y <= cy )
						)
						&&
						(
							( x >= cx && p.x >= cx ) ||
							( x <= cx && p.x <= cx )
						)
					)
					{
						return euclid_point.create( 'x', x, 'y', y );
					}
				}

				h += 3;

				break;

			default :

				// unknown hull section.
				throw new Error( );
		}

		pp = pn;
	}

	// no hull section created a projection.
	throw new Error( );
};


/*
| Returns true if point is within the shape.
*/
euclid_shape.prototype.within =
	function(
		view,
		p
	)
{
	return swatch.withinSketch( this, view, p );
};


})( );
