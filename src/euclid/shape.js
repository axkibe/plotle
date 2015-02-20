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
				pc :
					{
						comment :
							'center point',
						type :
							'euclid_point'
					}
			},
		ray :
			'->shapeSection'
	};
}


/*
| Gets the source of a projection to p.
|
| FIXME Move the section logic into shapeSection_*
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
		d,
		det,
		dx,
		dy,
		dxy,
		k,
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
/**/	if( this.get( 0 ).reflect !== 'shapeSection_start' )
/**/	{
/**/		// must have start at [0]
/**/		throw new Error( );
/**/	}
/**/}

	pstart = this.get( 0 ).p;

	pp = pstart;

	pn = null;

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

			pstart = null;
		}
		else
		{
			pn = section.p;
		}

		switch( section.reflect )
		{
			case 'shapeSection_line' :
			case 'shapeSection_flyLine' :

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
						return euclid_point.create( 'x', pix, 'y', piy );
					}
				}

				break;

			case 'shapeSection_round' :

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

	// no section created a projection.
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
