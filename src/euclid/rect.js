/*
| A rectangle.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'euclid_rect',
		attributes :
		{
			pnw :
			{
				comment : 'point in north west',
				json : true,
				type : 'euclid_point'
			},
			pse :
			{
				comment : 'point in south east',
				json : true,
				type : 'euclid_point'
			}
		}
	};
}


var
	euclid_point,
	euclid_rect,
	math_half,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	euclid_rect = jion.this( module, 'source' );

	math_half = require( '../math/half' );

	euclid_point = require( './point' );
}


prototype = euclid_rect.prototype;


/*
| returns a rect moved by a point or x/y
|
| add( point )   -or-
| add( x, y  )
*/
prototype.add =
	function(
		a1,
		a2
	)
{
	return(
		euclid_rect.create(
			'pnw', this.pnw.add( a1, a2 ),
			'pse', this.pse.add( a1, a2 )
		)
	);
};


/*
| Returns a resized rect with cardinal limits.
*/
prototype.cardinalResize =
	function(
		cardinal,  // 'n', 'ne', 'e', etc.
		dx,        // x-difference
		dy,        // y-difference
		minw,      // minimum width
		minh       // minimum height
	)
{
	var
		pnw,
		pse,
		wx,
		ny,
		ex,
		sy;

	pnw = this.pnw;

	pse = this.pse;

	switch( cardinal )
	{
		case 'n'  :

			wx = pnw.x;

			ny = Math.min( pnw.y + dy, pse.y - minh );

			ex = pse.x;

			sy = pse.y;

			break;

		case 'ne' :

			wx = pnw.x;

			ny = Math.min( pnw.y + dy, pse.y - minh );

			ex = Math.max( pse.x + dx, pnw.x + minw );

			sy = pse.y;

			break;

		case 'e'  :

			wx = pnw.x;

			ny = pnw.y;

			ex = Math.max( pse.x + dx, pnw.x + minw ),

			sy = pse.y;

			break;

		case 'se' :

			wx = pnw.x;

			ny = pnw.y;

			ex = Math.max( pse.x + dx, pnw.x + minw );

			sy = Math.max( pse.y + dy, pnw.y + minh );

			break;

		case 's' :

			wx = pnw.x;

			ny = pnw.y;

			ex = pse.x;

			sy = Math.max( pse.y + dy, pnw.y + minh );

			break;

		case 'sw'  :

			wx = Math.min( pnw.x + dx, pse.x - minw );

			ny = pnw.y;

			ex = pse.x;

			sy = Math.max( pse.y + dy, pnw.y + minh );

			break;

		case 'w'   :

			wx = Math.min( pnw.x + dx, pse.x - minw );

			ny = pnw.y;

			ex = pse.x;

			sy = pse.y;

			break;

		case 'nw' :

			wx = Math.min( pnw.x + dx, pse.x - minw );

			ny = Math.min( pnw.y + dy, pse.y - minh );

			ex = pse.x;

			sy = pse.y;

			break;

		default :

			// unknown cardinal
			throw new Error( );
	}

	return(
		this.create(
			'pnw', this.pnw.create( 'x', wx, 'y', ny ),
			'pse', this.pse.create( 'x', ex, 'y', sy )
		)
	);
};


/*
| Creates a rect by two arbitrary corner points
*/
euclid_rect.createArbitrary =
	function(
		p1,
		p2
	)
{
	var
		pnw,
		pse;

	if( p2.x >= p1.x && p2.y >= p1.y )
	{
		pnw = p1;

		pse = p2;
	}
	else if( p1.x >= p2.x && p1.y >= p2.y )
	{
		pnw = p2;

		pse = p1;
	}
	else if( p2.x >= p1.x && p1.y >= p2.y )
	{
		pnw = euclid_point.create( 'x', p1.x, 'y', p2.y );

		pse = euclid_point.create( 'x', p2.x, 'y', p1.y );
	}
	else if( p1.x >= p2.x && p2.y >= p1.y )
	{
		pnw = euclid_point.create( 'x', p2.x, 'y', p1.y );

		pse = euclid_point.create( 'x', p1.x, 'y', p2.y );
	}
	else
	{
		throw new Error( );
	}

	return euclid_rect.create( 'pnw', pnw, 'pse', pse );
};


/*
| North point.
*/
jion.lazyValue(
	prototype,
	'pn',
	function( )
{
	return(
		euclid_point.create(
			'x', math_half( this.pnw.x + this.pse.x ),
			'y', this.pnw.y
		)
	);
}
);


/*
| South point.
*/
jion.lazyValue(
	prototype,
	'ps',
	function( )
{
	return(
		euclid_point.create(
			'x', math_half( this.pnw.x + this.pse.x ),
			'y', this.pse.y
		)
	);
}
);


/*
| East point.
*/
jion.lazyValue(
	prototype,
	'pe',
	function( )
{
	return(
		euclid_point.create(
			'x', this.pse.x,
			'y', math_half( this.pse.y + this.pnw.y )
		)
	);
}
);


/*
| North east point.
*/
jion.lazyValue(
	prototype,
	'pne',
	function( )
{
	return(
		euclid_point.create(
			'x', this.pse.x,
			'y', this.pnw.y
		)
	);
}
);


/*
| South west point.
*/
jion.lazyValue(
	prototype,
	'psw',
	function( )
{
	return(
		euclid_point.create(
			'x', this.pnw.x,
			'y', this.pse.y
		)
	);
}
);


/*
| Returns a rect which has at least
| minHeight / minWidth
*/
prototype.ensureMinSize =
	function(
		minHeight,
		minWidth
	)
{
	if( this.width >= minWidth && this.height >= minHeight ) return this;

	return(
		this.create(
			'pse',
				this.pse.create(
					'x', Math.max( this.pse.x, this.pnw.x + minWidth ),
					'y', Math.max( this.pse.y, this.pnw.y + minHeight )
				)
		)
	);
};


/*
| Rectangle height.
*/
jion.lazyValue(
	prototype,
	'height',
	function( )
{
	return this.pse.y - this.pnw.y;
}
);


/*
| Returns this rect repositioned and resized to a view.
*/
prototype.inView =
	function(
		view
	)
{
	if( view.zoom === 1 )
	{
		return(
			( view.pan.x === 0 && view.pan.y === 0 )
			? this
			: this.add( view.pan )
		);
	}

	return(
		this.create(
			'pnw', this.pnw.inView( view ),
			'pse', this.pse.inView( view )
		)
	);
};


/*
| Returns a rectangle thats reduced on every side by a margin object
*/
prototype.reduce =
	function(
		margin
	)
{

/**/if( CHECK )
/**/{
/**/	if( margin.reflect !== 'euclid_margin' ) throw new Error( );
/**/}

	// allows margins to reduce the rect to zero size without erroring.

	return(
		euclid_rect.create(
			'pnw',
				this.pnw.create(
					'x', this.pnw.x + margin.e,
					'y', this.pnw.y + margin.n
				),
			'pse',
				this.pse.create(
					'x', this.pse.x - margin.w,
					'y', this.pse.y - margin.s
				)
		)
	);
};


/*
| Rectangle width.
*/
jion.lazyValue(
	prototype,
	'width',
	function( )
{
	return this.pse.x - this.pnw.x;
}
);


/*
| A rectangle of same size with pnw at 0/0
*/
jion.lazyValue(
	prototype,
	'zeroPnw',
	function( )
{
	if( this.pnw.x === 0 && this.pnw.y === 0 )
	{
		return this;
	}
	else
	{
		return(
			euclid_rect.create(
				'pnw', euclid_point.zero,
				'pse', this.pse.sub( this.pnw )
			)
		);
	}
}
);


/*
| Returns the point where a ray going from
| center of the rect (pc) to p intersects with the rect.
*/
prototype.getProjection =
	function(
		p
	)
{
	var
		pc,
		ny,
		ex,
		sy,
		wx,
		k,
		x,
		y;

	pc = this.pc,

	ny = this.pnw.y,

	ex = this.pse.x,

	sy = this.pse.y,

	wx = this.pnw.x,

	k = ( p.y - pc.y ) / ( p.x - pc.x );

	// y = (x - pc.x) * k + pc.y
	// x = (y - pc.y) / k + pc.x

	if( p.y <= ny )
	{
		x = ( ny - pc.y ) / k + pc.x;

		if ( x >= wx && x <= ex )
		{
			return euclid_point.create( 'x', x, 'y', ny );
		}
	}

	if( p.y >= sy )
	{
		x = ( sy - pc.y ) / k + pc.x;

		if( x >= wx && x <= ex )
		{
			return euclid_point.create( 'x', x, 'y', sy );
		}
	}

	if( p.x >= ex )
	{
		y = ( ex - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
		{
			return euclid_point.create( 'x', ex, 'y', y );
		}
	}

	if( p.x <= wx )
	{
		y = ( wx - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
		{
			return euclid_point.create( 'x', wx, 'y', y );
		}
	}

	return pc;
};


/*
| Point in the center.
*/
jion.lazyValue(
	prototype,
	'pc',
	function( )
{
	return(
		euclid_point.create(
			'x', math_half( this.pse.x + this.pnw.x ),
			'y', math_half( this.pse.y + this.pnw.y )
		)
	);
}
);


/*
| West point.
*/
jion.lazyValue(
	prototype,
	'pw',
	function( )
{
	return(
		euclid_point.create(
			'x', this.pnw.x,
			'y', math_half( this.pse.y + this.pnw.y )
		)
	);
}
);


/*
| Returns a rect moved by -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)
*/
prototype.sub =
	function(
		a1,
		a2
	)
{
	return(
		euclid_rect.create(
			'pnw', this.pnw.sub( a1, a2 ),
			'pse', this.pse.sub( a1, a2 )
		)
	);
};


/*
| Returns true if point is within this rect.
*/
prototype.within =
	function(
		p
	)
{
	var
		x,
		y,
		pnw,
		pse;

	x = p.x;

	y = p.y;

	pnw = this.pnw;

	pse = this.pse;

	return(
		x >= pnw.x
		&& y >= pnw.y
		&& x <= pse.x
		&& y <= pse.y
	);
};



} )( );
