/*
| A rectangle.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	euclid;

euclid = euclid || { };


/*
| Imports
*/
var
	jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'euclid.rect',
		attributes :
			{
				pnw :
					{
						comment :
							'point in north west',
						json :
							'true',
						type :
							'euclid.point'
					},
				pse :
					{
						comment :
							'point in south east',
						json :
							'true',
						type :
							'euclid.point'
					}
			},
		node :
			true
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	euclid.point = require( './point' );

	euclid.rect = require( '../jion/this' )( module );
}


var
	rect;

rect = euclid.rect;


/*
| Creates a rect by two arbitrary corner points
*/
rect.createArbitrary =
	function(
		p1,
		p2
	)
{
	var
		pnw,
		pse;

	if(
		p2.x >= p1.x
		&&
		p2.y >= p1.y
	)
	{
		pnw = p1;

		pse = p2;
	}
	else if(
		p1.x >= p2.x &&
		p1.y >= p2.y
	)
	{
		pnw = p2;

		pse = p1;
	}
	else if(
		p2.x >= p1.x &&
		p1.y >= p2.y
	)
	{
		pnw = euclid.point.create( 'x', p1.x, 'y', p2.y );

		pse = euclid.point.create( 'x', p2.x, 'y', p1.y );
	}
	else if(
		p1.x >= p2.x &&
		p2.y >= p1.y
	)
	{
		pnw = euclid.point.create( 'x', p2.x, 'y', p1.y );

		pse = euclid.point.create( 'x', p1.x, 'y', p2.y );
	}
	else
	{
		throw new Error( );
	}

	return(
		rect.create(
			'pnw',
				pnw,
			'pse',
				pse
		)
	);
};


/*
| Rectangle width.
*/
jools.lazyValue(
	rect.prototype,
	'width',
	function( )
	{
		return this.pse.x - this.pnw.x;
	}
);


/*
| Rectangle height.
*/
jools.lazyValue(
	rect.prototype,
	'height',
	function( )
	{
		return this.pse.y - this.pnw.y;
	}
);


/*
| A rectangle of same size with pnw at 0/0
*/
jools.lazyValue(
	rect.prototype,
	'zeropnw',
	function( )
	{
		if (
			this.pnw.x === 0
			&&
			this.pnw.y === 0
		)
		{
			return this;
		}
		else
		{
			return (
				rect.create(
					'pnw',
						euclid.point.zero,
					'pse',
						this.pse.sub( this.pnw )
				)
			);
		}
	}
);


/*
| Computes an ellipse modelled relative to this rect.
*/
rect.prototype.computeEllipse =
	function(
		model
	)
{
	return (
		euclid.ellipse.create(
			'pnw',
				model.pnw.compute( this ),
			'pse',
				model.pse.compute( this )
		)
	);
};


/*
| Returns a rectangle thats reduced on every side by a margin object
*/
rect.prototype.reduce =
	function(
		margin
	)
{
	// FIXME use reflect when a jion

/**/if( CHECK )
/**/{
/**/	if( margin.constructor !== euclid.margin )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	// allows margins to reduce the rect to zero size without erroring.

	return (
		rect.create(
			'pnw',
				euclid.point.renew(
					this.pnw.x + margin.e,
					this.pnw.y + margin.n,
					this.pnw,
					this.pse
				),
			'pse',
				euclid.point.renew(
					this.pse.x - margin.w,
					this.pse.y - margin.s,
					this.pnw,
					this.pse
				)
		)
	);
};


/*
| Returns a resized rect with cardinal limits.
*/
rect.prototype.cardinalResize =
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

			ny =
				Math.min(
					pnw.y + dy,
					pse.y - minh
				);

			ex = pse.x;

			sy = pse.y;

			break;

		case 'ne' :

			wx = pnw.x;

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

			sy = pse.y;

			break;

		case 'e'  :

			wx = pnw.x;

			ny = pnw.y;

			ex =
				Math.max(
					pse.x + dx,
					pnw.x + minw
				),

			sy = pse.y;

			break;

		case 'se' :

			wx = pnw.x;

			ny = pnw.y;

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

			wx = pnw.x;

			ny = pnw.y;

			ex = pse.x;

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

			ny = pnw.y;

			ex = pse.x;

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

			ny = pnw.y;

			ex = pse.x;

			sy = pse.y;

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

			ex = pse.x;

			sy = pse.y;

			break;

		default  :

			// unknown cardinal
			throw new Error( );
	}

	return(
		rect.renew(
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
jools.lazyValue(
	rect.prototype,
	'pc',
	function( )
	{
		return (
			euclid.point.create(
				'x',
					jools.half( this.pse.x + this.pnw.x ),
				'y',
					jools.half( this.pse.y + this.pnw.y )
			)
		);
	}
);


/*
| Point in the north.
*/
jools.lazyValue(
	rect.prototype,
	'pn',
	function( )
	{
		return (
			euclid.point.create(
				'x',
					jools.half( this.pse.x + this.pnw.x ),
				'y',
					this.pnw.y
			)
		);
	}
);


/*
| West point.
*/
jools.lazyValue(
	rect.prototype,
	'w',
	function( )
	{
		return (
			euclid.point.create(
				'x',
					this.pnw.x,
				'y',
					jools.half( this.pse.y + this.pnw.y )
			)
		);
	}
);


/*
| East point.
*/
jools.lazyValue(
	rect.prototype,
	'e',
	function( )
	{
		return (
			euclid.point.create(
				'x',
					this.pse.x,
				'y',
					jools.half( this.pse.y + this.pnw.y )
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
rect.prototype.add =
	function(
		a1,
		a2
	)
{
	return (
		rect.create(
			'pnw',
				this.pnw.add( a1, a2 ),
			'pse',
				this.pse.add( a1, a2 )
		)
	);
};


/*
| Creates a new rect.
*/
rect.renew =
	function(
		wx,
		ny,
		ex,
		sy
		//, ...  a list of additional rects to look for objects to be reused
	)
{
	// FIXMe
	var
		pnw = null,

		pse = null,

		isnon = jools.isnon,

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
			euclid.point.create( 'x', wx, 'y', ny );
	}

	if( !pse )
	{
		pse =
			euclid.point.create( 'x', ex, 'y', sy );
	}

	return (
		rect.create(
			'pnw',
				pnw,
			'pse',
				pse
		)
	);
};


/*
| Returns a rect moved by -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)
*/
rect.prototype.sub =
	function(
		a1,
		a2
	)
{
	return (
		rect.create(
			'pnw',
				this.pnw.sub( a1, a2 ),
			'pse',
				this.pse.sub( a1, a2 )
		)
	);
};


/*
| Returns true if this rectangle is the same as another
*/
rect.prototype.equals =
	function(
		r
	)
{
	return (
		this === r
		||
		(
			this.pnw.equals( r.pnw ) &&
			this.pse.equals( r.pse )
		)
	);
};


/*
| Draws the rectangle.
*/
rect.prototype.sketch =
	function(
		fabric,
		border,
		twist,
		view
	)
{
	var
		wx,
		ny,
		ex,
		sy;

	wx = view.x( this.pnw.x );

	ny = view.y( this.pnw.y );

	ex = view.x( this.pse.x );

	sy = view.y( this.pse.y );

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
rect.prototype.within =
	function(
		view,
		p
	)
{
	var
		x,
		y,
		pnw,
		pse;

	x =
		view
		? view.dex( p.x )
		: p.x;

	y =
		view
		?  view.dey( p.y )
		: p.y;

	pnw = this.pnw;

	pse = this.pse;

	return (
		x >= pnw.x
		&&
		y >= pnw.y
		&&
		x <= pse.x
		&&
		y <= pse.y
	);
};


/*
| Returns the point where a ray going from
| center of the rect (pc) to p intersects with the rect.
*/
rect.prototype.getProjection =
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
			return euclid.point.create( 'x', x, 'y', ny );
		}
	}

	if( p.y >= sy )
	{
		x = ( sy - pc.y ) / k + pc.x;

		if( x >= wx && x <= ex )
		{
			return euclid.point.create( 'x', x, 'y', sy );
		}
	}

	if( p.x >= ex )
	{
		y = ( ex - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
		{
			return euclid.point.create( 'x', ex, 'y', y );
		}
	}

	if( p.x <= wx )
	{
		y = ( wx - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
		{
			return euclid.point.create( 'x', wx, 'y', y );
		}
	}

	return pc;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = rect;
}

} )( );
