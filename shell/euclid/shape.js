/*
| A geometric shape.
|
| Used by Ellipse, RoundRect
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Euclid;


Euclid =
	Euclid || { };


/*
| Imports
*/
var
	Euclid,
	swatch;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition
*/
if( JOOBJ )
{
	return {

		name :
			'Shape',

		unit :
			'Euclid',

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
							'Point'
					}
			},

		equals :
			'primitive'
	};
}


var
	Shape =
		Euclid.Shape;


/*
| Draws the shape.
*/
Shape.prototype.sketch =
	function(
		fabric,
		border,
		twist,
		view
	)
{
	var
		hull =
			this.hull,

		h =
			0,

		hZ =
			hull.length;

/**/if( CHECK )
/**/{
/**/	if( hull[ h++ ] !== 'start' )
/**/	{
/**/		throw new Error(
/**/			'hull must have start at [  0]'
/**/		);
/**/	}
/**/}

	var
		pstart =
			view.point( hull [ h++ ] ),

		pc =
			view.point( this.pc );

	pstart =
		pstart.add(
			pstart.x > pc.x ?
				-border :
				( pstart.x < pc.x ? border : 0 ),
			pstart.y > pc.y ?
				-border :
				( pstart.y < pc.y ? border : 0 )
		);

	var
		pp =
			pstart,

		pn =
			null,

		dx,
		dy,
		magic;

	fabric.moveTo( pstart );

	while( h < hZ )
	{

/**/	if( CHECK )
/**/	{
/**/		if( !pstart )
/**/		{
/**/			throw new Error( 'hull closed prematurely' );
/**/		}
/**/	}

		switch( hull[ h ] )
		{

			case 'bezier' :

				pn =
					hull[ h + 5 ];

				break;

			case 'line' :

				pn =
					hull[ h + 1 ];

				break;

			case 'round' :

				pn =
					hull[ h + 2 ];

				magic =
					Euclid.Const.magic;

				break;

			default :

				throw new Error(
					'unknown hull section: ' + hull[ h ]
				);

		}

		if( pn === 'close' )
		{
			pn =
				pstart;

			pstart =
				null;
		}
		else
		{
			pn =
				view.point( pn );

			if( border !== 0 )
			{
				pn = pn.add(
					pn.x > pc.x ?
						-border
						:
						(
							pn.x < pc.x ?
								border
								:
								0
						),
					pn.y > pc.y ?
						-border
						:
						(
							pn.y < pc.y ?
								border
								:
								0
						)
				);
			}
		}

		switch( hull[h] )
		{

			case 'bezier' :

				dx =
					pn.x - pp.x;

				dy =
					pn.y - pp.y;

				fabric.beziTo(
					hull[ h + 1 ] * dx,
					hull[ h + 2 ] * dy,
					-hull[ h + 3 ] * dx,
					-hull[ h + 4 ] * dy,
					pn
				);

				h += 6;

				break;

			case 'line' :

				fabric.lineTo( pn );

				h += 2;

				break;

			case 'round' :

				dx = pn.x - pp.x;
				dy = pn.y - pp.y;

				var
					rotation =
						hull[ h + 1 ],

					dxy =
						dx * dy;

				switch( rotation )
				{
					case 'clockwise' :

						fabric.beziTo(
							dxy > 0 ?   magic * dx : 0,
							dxy < 0 ?   magic * dy : 0,
							dxy < 0 ? - magic * dx : 0,
							dxy > 0 ? - magic * dy : 0,
							pn
						);

						break;

					default :

/**/					if( CHECK )
/**/					{
/**/						throw new Error(
/**/							'unknown rotation'
/**/						);
/**/					}
				}

				h += 3;

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error(
/**/					'unknown hull section: ' + hull[h]
/**/				);
/**/			}
		}

		pp =
			pn;
	}

/**/if( CHECK )
/**/{
/**/	if( pstart !== null )
/**/	{
/**/		throw new Error(
/**/			'hull did not close'
/**/		);
/**/	}
/**/}

};


/*
| Gets the source of a projection to p.
*/
Shape.prototype.getProjection =
	function(
		p
	)
{
	var
		hull =
			this.hull,

		h =
			0,

		hZ =
			hull.length,

		pc =
			this.pc;

/**/if( CHECK )
/**/{
/**/	if( hull[ h++ ] !== 'start' )
/**/	{
/**/		throw new Error(
/**/			'hull must have start at [0]'
/**/		);
/**/	}
/**/}

	var
		pstart =
			hull [ h++ ],

		pp =
			pstart,

		pn =
			null,

		dx,
		dy,
		dxy,
		cx,
		cy,
		a,
		b;

	while( h < hZ )
	{
/**/	if( CHECK )
/**/	{
/**/		if( !pstart )
/**/		{
/**/			throw new Error(
/**/				'hull closed prematurely'
/**/			);
/**/		}
/**/	}

		switch( hull[ h ] )
		{

			case 'bezier' :

				pn =
					hull[ h + 5 ];

				break;

			case 'line' :

				pn =
					hull[ h + 1 ];

				break;

			case 'round' :

				pn =
					hull[ h + 2 ];

				break;

			default :

				throw new Error(
					'unknown hull section: ' + hull[h]
				);
		}

		if( pn === 'close')
		{
			pn =
				pstart;

			pstart =
				null;
		}

		switch( hull[h] )
		{

			case 'bezier' :

/**/			if( CHECK )
/**/			{
/**/				throw new Error(
/**/					'cannot yet do projections for beziers '
/**/				);
/**/			}

				break;

			case 'line' :

				var
					la1 =
						p.y - pc.y,

					lb1 =
						pc.x -  p.x,

					lc1 =
						la1 * pc.x + lb1 * pc.y,

					la2 =
						pn.y - pp.y,

					lb2 =
						pp.x - pn.x,

					lc2 =
						la2 * pp.x + lb2 * pp.y,

					det =
						la1 * lb2 - la2 * lb1;

				if( det !== 0 )
				{
					var
						pix =
							( lb2 * lc1 - lb1 * lc2 ) / det,

						piy =
							( la1 * lc2 - la2 * lc1 ) / det;

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
						return (
							Euclid.Point.create(
								'x',
									pix,
								'y',
									piy
							)
						);
					}
				}

				h += 2;

				break;

			case 'round' :

				dx =
					pn.x - pp.x;

				dy =
					pn.y - pp.y;

				dxy =
					dx * dy;

				if( dxy > 0 )
				{
					cx =
						pp.x;

					cy =
						pn.y;

					a  =
						Math.abs( pn.x - cx );

					b  =
						Math.abs( pp.y - cy );
				}
				else
				{
					cx =
						pn.x;

					cy =
						pp.y;

					a =
						Math.abs( pp.x - cx );

					b =
						Math.abs( pn.y - cy );
				}

				if(
					(
						( p.x < cx || dy <= 0 )
						&&
						( p.x > cx || dy >= 0 )
					)
					||
					(
						( p.y < cy || dx >= 0 )
						&&
						( p.y > cy || dx <= 0 )
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
						return (
							Euclid.Point.create(
								'x',
									cx,
								'y',
									cy + b
							)
						);
					}
					else if( p.y < cy )
					{
						return (
							Euclid.Point.create(
								'x',
									cx,
								'y',
									cy - b
							)
						);
					}
					else if( p.y === cy )
					{
						return (
							Euclid.Point.create(
								'x',
									cx,
								'y',
									cy
							)
						);
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

					var
						y =
							k * x + d;

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
						return Euclid.Point.create( 'x', x, 'y', y );
					}
				}

				h += 3;

				break;

			default :

				throw new Error(
					'unknown hull section: ' + hull[h]
				);

		}

		pp = pn;
	}

	throw new Error(
		'no hull section created a projection'
	);
};


/*
| Returns true if point is within the shape.
*/
Shape.prototype.within =
	function(
		view,
		p
	)
{
	return swatch.withinSketch(
		this,
		'sketch',
		view,
		p
	);
};



})( );
