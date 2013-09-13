/*
| A rectangle.
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
	Jools,
	shellverse;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
*/
var Rect =
Euclid.Rect =
	function(
		tag,
		twig,
		ranks
	)
{
	if( tag !== 'TREE' )
	{
		throw new Error(
			'invalid tag'
		);
	}

	var
		pnw =
		this.pnw =
			twig.pnw;

	var
		pse =
		this.pse =
			twig.pse;

	if(
		pnw.x > pse.x ||
		pnw.y > pse.y
	)
	{
		throw Jools.reject(
			'not a rectangle.'
		);
	}

	this.type =
		'Rect'; // FIXME - can this be circumvented?

	Jools.immute( this );
};

Rect.create =
	function(
		overload,
		a1,
		a2,
		a3
	)
{
	var
		pnw,
		pse;

	switch( overload )
	{
		case 'pnw/pse' :

			pnw =
				a1;

			pse =
				a2;

			break;

		case 'pnw/size' :

			pnw =
				a1;

			pse =
				a1.add( a2, a3 );

			break;

		case 'pse' :

			pnw =
				Euclid.Point.zero;

			pse =
				a1;

			break;

		case 'o' :

			pnw =
				a1.pnw;

			pse =
				a1.pse;

			break;

		case 'arbitrary' :

			if(
				a2.x >= a1.x &&
				a2.y >= a1.y
			)
			{
				pnw = a1;
				pse = a2;
			}
			else if (
				a1.x >= a2.x &&
				a1.y >= a2.y
			)
			{
				pnw = a2;
				pse = a1;
			}
			else if(
				a2.x >= a1.x &&
				a1.y >= a2.y
			)
			{
				pnw =
					shellverse.grow(
						'Point',
						'x',
							a1.x,
						'y',
							a2.y
					);

				pse =
					shellverse.grow(
						'Point',
						'x',
							a2.x,
						'y',
							a1.y
					);
			}
			else if (
				a1.x >= a2.x &&
				a2.y >= a1.y
			)
			{
				pnw =
					shellverse.grow(
						'Point',
						shellverse,
						'x',
							a2.x,
						'y',
							a1.y
					);

				pse =
					shellverse.grow(
						'Point',
						shellverse,
						'x',
							a1.x,
						'y',
							a2.y
					);
			}
			else
			{
				throw new Error(
					'this is not possible'
				);
			}
			break;

		default :

			throw new Error(
				'invalid overload'
			);
	}

	return shellverse.grow(
		'Rect',
		'pnw',
			pnw,
		'pse',
			pse
	);
};


/*
| Rectangle width.
*/
Jools.lazyFixate(
	Rect.prototype,
	'width',
	function( )
	{
		return this.pse.x - this.pnw.x;
	}
);

/*
| Rectangle height.
*/
Jools.lazyFixate(
	Rect.prototype,
	'height',
	function( )
	{
		return this.pse.y - this.pnw.y;
	}
);


/*
| A rectangle of same size with pnw at 0/0
*/
Jools.lazyFixate(
	Rect.prototype,
	'zeropnw',
	function( )
	{
		if (
			this.pnw.x === 0 &&
			this.pnw.y === 0
		)
		{
			return this;
		}
		else
		{
			return Rect.create(
				'pse',
				this.pse.sub( this.pnw )
			)
		}
	}
);


/*
| Computes a point modelled relative to this rect.
*/
Rect.prototype.computePoint =
	function(
		model
	)
{
	var
		half =
			Jools.half,

		twig =
			model.twig,

		pnw =
			this.pnw,

		pse =
			this.pse;

	switch( twig.anchor )
	{
		case 'c'  :

			return (
				shellverse.grow(
					'Point',
					'x',
						half( pnw.x + pse.x ) + twig.x,
					'y',
						half( pnw.y + pse.y ) + twig.y
				)
			);

		case 'n'  :

			return (
				shellverse.grow(
					'Point',
					'x',
						half( pnw.x + pse.x ) + twig.x,
					'y',
						twig.y + twig.y
				)
			);

		case 'ne' :

			return (
				shellverse.grow(
					'Point',
					shellverse,
					'x',
						pse.x + twig.x,
					'y',
						pnw.y + twig.y
				)
			);

		case 'e'  :

			return (
				shellverse.grow(
					'Point',
					shellverse,
					'x',
						pse.x + twig.x,
					'y',
						half( pnw.y + pse.y ) + twig.y
				)
			);

		case 'se' :

			return (
				pse.add(
					twig.x,
					twig.y
				)
			);

		case 's'  :

			return (
				shellverse.grow(
					'Point',
					shellverse,
					'x',
						half( pnw.x + pse.x ) + twig.x,
					'y',
						pse.y + twig.y
				)
			);

		case 'sw' :

			return (
				shellverse.grow(
					'Point',
					'x',
						pnw.x + twig.x,
					'y',
						pse.y + twig.y
				)
			);

		case 'w'  :

			return (
				shellverse.grow(
					'Point',
					'x',
						pnw.x + twig.x,
					'y',
						half( pnw.y + pse.y ) +
						twig.y
				)
			);

		case 'nw' :

			return (
				pnw.add(
					twig.x,
					twig.y
				)
			);

		default :

			throw new Error(
				'Invalid anchor: ' +
				twig.anchor
			);
	}
};


/*
| Computes a rect modelled relative to this rect.
*/
Rect.prototype.computeRect =
	function(
		model
	)
{
	return Rect.create(
		'pnw/pse',
		this.computePoint( model.pnw ),
		this.computePoint( model.pse )
	);
};


/*
| Computes an ellipse modelled relative to this rect.
*/
Rect.prototype.computeEllipse =
	function(
		model
	)
{
	return new Euclid.Ellipse(
		this.computePoint( model.pnw ),
		this.computePoint( model.pse )
	);
};

/*
| Returns a rectangle thats reduced on every side by a margin object
*/
Rect.prototype.reduce =
	function(
		margin
	)
{
	if( margin.constructor !== Euclid.Margin )
	{
		throw new Error( 'margin of wrong type' );
	}

	// allows margins to reduce the rect to zero size without erroring.

	return Rect.create(
		'pnw/pse',
		Euclid.Point.renew(
			this.pnw.x + margin.e,
			this.pnw.y + margin.n,
			this.pnw,
			this.pse
		),
		Euclid.Point.renew(
			this.pse.x - margin.w,
			this.pse.y - margin.s,
			this.pnw,
			this.pse
		)
	);
};


/*
| Returns a resized rect with cardinal limits.
*/
Rect.prototype.cardinalResize =
	function(
		cardinal,  // 'n', 'ne', 'e', etc.
		dx,        // x-difference
		dy,        // y-difference
		minw,      // minimum width
		minh       // minimum height
	)
{
	var
		pnw =
			this.pnw,

		pse =
			this.pse,

		wx,

		ny,

		ex,

		sy;

	switch( cardinal )
	{
		case 'n'  :

			wx =
				pnw.x;

			ny =
				Math.min(
					pnw.y + dy,
					pse.y - minh
				);

			ex =
				pse.x;

			sy =
				pse.y;

			break;

		case 'ne' :

			wx =
				pnw.x;

			ny =
				Math.min(
					pnw.y + dy,
					pse.y - minh
				);

			ex =
				Math.max(
					pse.x + dx,
					pnw.x + minw
				);

			sy =
				pse.y;

			break;

		case 'e'  :

			wx =
				pnw.x;

			ny =
				pnw.y;

			ex =
				Math.max(
					pse.x + dx,
					pnw.x + minw
				),

			sy =
				pse.y;

			break;

		case 'se' :

			wx =
				pnw.x;

			ny =
				pnw.y;

			ex =
				Math.max(
					pse.x + dx,
					pnw.x + minw
				);

			sy =
				Math.max(
					pse.y + dy,
					pnw.y + minh
				);

			break;

		case 's' :

			wx =
				pnw.x;

			ny =
				pnw.y;

			ex =
				pse.x;

			sy =
				Math.max(
					pse.y + dy,
					pnw.y + minh
				);

			break;

		case 'sw'  :

			wx =
				Math.min(
					pnw.x + dx,
					pse.x - minw
				);

			ny =
				pnw.y;

			ex =
				pse.x;

			sy =
				Math.max(
					pse.y + dy,
					pnw.y + minh
				);

			break;

		case 'w'   :

			wx =
				Math.min(
					pnw.x + dx,
					pse.x - minw
				);

			ny =
				pnw.y;

			ex =
				pse.x;

			sy =
				pse.y;

			break;

		case 'nw' :

			wx =
				Math.min(
					pnw.x + dx,
					pse.x - minw
				);

			ny =
				Math.min(
					pnw.y + dy,
					pse.y - minh
				);

			ex =
				pse.x;

			sy =
				pse.y;

			break;

		default  :
			throw new Error( 'unknown cardinal' );
	}

	return (
		Rect.renew(
			wx,
			ny,
			ex,
			sy,
			this
		)
	);
};


/*
| Point in the center.
*/
Jools.lazyFixate(
	Rect.prototype,
	'pc',
	function( )
	{
		return (
			shellverse.grow(
				'Point',
				'x',
					Jools.half( this.pse.x + this.pnw.x ),
				'y',
					Jools.half( this.pse.y + this.pnw.y )
			)
		);
	}
);


/*
| Point in the north.
*/
Jools.lazyFixate(
	Rect.prototype,
	'pn',
	function( )
	{
		return (
			shellverse.grow(
				'Point',
				'x',
					Jools.half( this.pse.x + this.pnw.x ),
				'y',
					this.pnw.y
			)
		);
	}
);


/*
| West point.
*/
Jools.lazyFixate(
	Rect.prototype,
	'w',
	function( )
	{
		return (
			shellverse.grow(
				'Point',
				'x',
					this.pnw.x,
				'y',
					Jools.half( this.pse.y + this.pnw.y )
			)
		);
	}
);


/*
| East point.
*/
Jools.lazyFixate(
	Rect.prototype,
	'e',
	function( )
	{
		return (
			shellverse.grow(
				'Point',
				'x',
					this.pse.x,
				'y',
					Jools.half( this.pse.y + this.pnw.y )
			)
		);
	}
);


/*
| returns a rect moved by a point or x/y
|
| add( point )   -or-
| add( x, y  )
*/
Rect.prototype.add =
	function(
		a1,
		a2
	)
{
	return Rect.create(
		'pnw/pse',
		this.pnw.add( a1, a2 ),
		this.pse.add( a1, a2 )
	);
};


/*
| Creates a new rect.
*/
Rect.renew =
	function(
		wx,
		ny,
		ex,
		sy
		//, ...  a list of additional rects to look for objects to be reused
	)
{
	var
		pnw =
			null,

		pse =
			null,

		isnon =
			Jools.isnon,

		a,
		aZ,
		r;

	for(
		a = 4, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		r = arguments[ a ];

		if ( !isnon( r ) )
		{
			continue;
		}

		if( r.pnw.x === wx && r.pnw.y === ny )
		{
			if( r.pse.x === ex && r.pse.y === sy )
			{
				return r;
			}

			pnw =
				r.pnw;

			break;
		}

		if ( r.pse.x === wx && r.pse.y === ny )
		{
			pnw =
				r.pse;

			break;
		}
	}

	for(
		a = 4, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		r =
			arguments[ a ];

		if( !isnon( r ) )
		{
			continue;
		}

		if( r.pnw.x === ex && r.pnw.y === sy )
		{
			pse =
				r.pnw;

			break;
		}

		if( r.pse.x === ex && r.pse.y === sy )
		{
			pse =
				r.pse;

			break;
		}
	}

	if( !pnw )
	{
		pnw =
			shellverse.grow(
				'Point',
				'x',
					wx,
				'y',
					ny
			);
	}

	if( !pse )
	{
		pse =
			shellverse.grow(
				'Point',
				'x',
					ex,
				'y',
					sy
			);
	}

	return Rect.create(
		'pnw/pse',
		pnw,
		pse
	);
};


/*
| Returns a rect moved by -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)
*/
Rect.prototype.sub =
	function(
		a1,
		a2
	)
{
	return Rect.create(
		'pnw/pse',
		this.pnw.sub( a1, a2 ),
		this.pse.sub( a1, a2 )
	);
};


/*
| Returns true if this rectangle is the same as another
*/
Rect.prototype.equals =
	function(
		r
	)
{
	return (
		this.pnw.equals( r.pnw ) &&
		this.pse.equals( r.pse )
	);
};


/*
| Draws the rectangle.
*/
Rect.prototype.sketch =
	function(
		fabric,
		border,
		twist,
		view
	)
{
	var
		wx =
			view.x( this.pnw );

	var
		ny =
			view.y( this.pnw );

	var
		ex =
			view.x( this.pse );

	var
		sy =
			view.y( this.pse );

	fabric.moveTo(
		wx + border,
		ny + border
	);

	fabric.lineTo(
		ex - border,
		ny + border
	);

	fabric.lineTo(
		ex - border,
		sy - border
	);

	fabric.lineTo(
		wx + border,
		sy - border
	);

	fabric.lineTo(
		wx + border,
		ny + border
	);
};


/*
| Returns true if point is within this rect.
*/
Rect.prototype.within =
	function(
		view,
		p
	)
{
	var
		x =
			view ?
				view.dex( p ) :
				p.x,

		y =
			view ?
				view.dey( p ) :
				p.y,

		pnw =
			this.pnw,

		pse =
			this.pse;

	return (
		x >= pnw.x &&
		y >= pnw.y &&
		x <= pse.x &&
		y <= pse.y
	);
};


/*
| Returns the point where a ray going from
| center of the rect (pc) to p intersects with the rect.
*/
Rect.prototype.getProjection =
	function(
		p
	)
{
	var
		pc =
			this.pc,

		ny =
			this.pnw.y,

		ex =
			this.pse.x,

		sy =
			this.pse.y,

		wx =
			this.pnw.x,

		k =
			( p.y - pc.y ) / ( p.x - pc.x ),

		x, y;

	// y = (x - pc.x) * k + pc.y
	// x = (y - pc.y) / k + pc.x

	if( p.y <= ny )
	{
		x =
			( ny - pc.y ) / k + pc.x;

		if ( x >= wx && x <= ex )
		{
			return (
				shellverse.grow(
					'Point',
					'x',
						x,
					'y',
						ny
				)
			);
		}
	}

	if( p.y >= sy )
	{
		x =
			( sy - pc.y ) / k + pc.x;

		if( x >= wx && x <= ex )
		{
			return (
				shellverse.grow(
					'Point',
					'x',
						x,
					'y',
						sy
				)
			);
		}
	}

	if( p.x >= ex )
	{
		y =
			( ex - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
		{
			return (
				shellverse.grow(
					'Point',
					'x',
						ex,
					'y',
						y
				)
			);
		}
	}

	if( p.x <= wx )
	{
		y =
			( wx - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
		{
			return (
				shellverse.grow(
					'Point',
					'x',
						wx,
					'y',
						y
				)
			);
		}
	}

	return pc;
};


})( );
