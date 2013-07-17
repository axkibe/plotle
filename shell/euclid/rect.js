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
	Jools,
	Euclid;


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
		pnw,
		pse
	)
{
	if( arguments.length !== 2 )
	{
		throw new Error('WTF');
	}
	if(
		pnw.x > pse.x ||
		pnw.y > pse.y
	)
	{
		throw Jools.reject(
			'not a rectangle.'
		);
	}

	this.pnw =
		pnw;

	this.pse =
		pse;

	// TODO lazyFixate
	Jools.innumerable(
		this,
		'width',
		pse.x - pnw.x
	);

	Jools.innumerable(
		this,
		'height',
		pse.y - pnw.y
	);

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
		case 'twig' :

			pnw =
				new Euclid.Point(
					a1.twig.pnw.twig.x,
					a1.twig.pnw.twig.y
				);

			pse =
				new Euclid.Point(
					a1.twig.pse.twig.x,
					a1.twig.pse.twig.y
				);

			break;

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
					new Euclid.Point(
						a1.x,
						a2.y
					);

				pse =
					new Euclid.Point(
						a2.x,
						a1.y
					);
			}
			else if (
				a1.x >= a2.x &&
				a2.y >= a1.y
			)
			{
				pnw =
					new Euclid.Point(
						a2.x,
						a1.y
					);

				pse =
					new Euclid.Point(
						a1.x,
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

	return new Rect(
		pnw,
		pse
	);
};


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

			return new Euclid.Point(
				half( pnw.x + pse.x ) + twig.x,
				half( pnw.y + pse.y ) + twig.y
			);

		case 'n'  :

			return new Euclid.Point(
				half( pnw.x + pse.x ) + twig.x,
				twig.y + twig.y
			);

		case 'ne' :

			return new Euclid.Point(
				pse.x + twig.x,
				pnw.y + twig.y
			);

		case 'e'  :

			return new Euclid.Point(
				pse.x + twig.x,
				half( pnw.y + pse.y ) + twig.y
			);

		case 'se' :

			return pse.add(
				twig.x,
				twig.y
			);

		case 's'  :

			return new Euclid.Point(
				half( pnw.x + pse.x ) + twig.x,
				pse.y + twig.y
			);

		case 'sw' :

			return new Euclid.Point(
				pnw.x + twig.x,
				pse.y + twig.y
			);

		case 'w'  :

			return new Euclid.Point(
				pnw.x + twig.x,
				half( pnw.y + pse.y ) + twig.y
			);

		case 'nw' :

			return pnw.add(
				twig.x,
				twig.y
			);

		default :

			throw new Error(
				'Invalid anchor: ' + twig.anchor
			);
	}
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
| point in the center
*/
Jools.lazyFixate(
	Rect.prototype,
	'pc',
	function( )
	{
		return new Euclid.Point(
			Jools.half( this.pse.x + this.pnw.x ),
			Jools.half( this.pse.y + this.pnw.y )
		);
	}
);


/*
| point in the north
*/
Jools.lazyFixate(
	Rect.prototype,
	'pn',
	function( )
	{
		return new Euclid.Point(
			Jools.half( this.pse.x + this.pnw.x ),
			this.pnw.y
		);
	}
);


/*
| west point
*/
Jools.lazyFixate(
	Rect.prototype,
	'w',
	function( )
	{
		return new Euclid.Point(
			this.pnw.x,
			Jools.half( this.pse.y + this.pnw.y )
		);
	}
);


/*
| east point
*/
Jools.lazyFixate(
	Rect.prototype,
	'e',
	function( )
	{
		return new Euclid.Point(
			this.pse.x,
			Jools.half( this.pse.y + this.pnw.y )
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
			pse = r.pnw;

			break;
		}

		if( r.pse.x === ex && r.pse.y === sy )
		{
			pse = r.pse;

			break;
		}
	}

	if( !pnw )
	{
		pnw =
			new
				Euclid.Point( wx, ny );
	}

	if( !pse )
	{
		pse =
			new
				Euclid.Point( ex, sy );
	}

	return Rect.create(
		'pnw/pse',
		pnw,
		pse
	);
};


/*
| Returns a rect moved by a -point or -x/-y.
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
			view ? view.dex( p ) : p,

		y =
			view ? view.dey( p ) : p,

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
	function( p )
{
	var pc =
		this.pc;

	var ny =
		this.pnw.y;

	var ex =
		this.pse.x;

	var sy =
		this.pse.y;

	var wx =
		this.pnw.x;

	var k =
		( p.y - pc.y ) / ( p.x - pc.x );

	var x, y;

	// y = (x - pc.x) * k + pc.y
	// x = (y - pc.y) / k + pc.x

	if( p.y <= ny )
	{
		x =
			( ny - pc.y ) / k + pc.x;

		if ( x >= wx && x <= ex )
		{
			return new Euclid.Point( x, ny );
		}
	}

	if( p.y >= sy )
	{
		x =
			( sy - pc.y ) / k + pc.x;

		if( x >= wx && x <= ex )
		{
			return new Euclid.Point( x, sy );
		}
	}

	if( p.x >= ex )
	{
		y =
			( ex - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
		{
			return new Euclid.Point( ex, y );
		}
	}

	if( p.x <= wx )
	{
		y =
			( wx - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
		{
			return new Euclid.Point( wx, y );
		}
	}

	return pc;
};


})( );
