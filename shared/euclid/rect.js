/*
|
| A rectangle.
|
| Authors: Axel Kittenberger
|
*/


/*
| Export
*/
var Euclid;
Euclid = Euclid || {};


/*
| Imports
*/
var Jools;
var Euclid;

/**
| Capsule
*/
(function(){
'use strict';


/*
| Node imports
*/
if( typeof( window ) === 'undefined' )
{
	Euclid = {
		Point  : require( './point'  ),
		Margin : require( './margin' )
	};

	Jools  = require( '../jools' );
}


/*
| Constructor.
|
| pnw: point to north west.
| pse: point to south east.
*/
var Rect = Euclid.Rect =
	function(
		overload,
		a1,
		a2
	)
{
	switch( overload ) {

		case 'pnw/pse' :
			this.pnw = a1;
			this.pse = a2;
			break;

		case 'pse' :
			this.pnw = Euclid.Point.Zero;
			this.pse = a1;
			break;

		case 'rect' :
			throw new Error('this makes no sense');

		case 'o' :
			this.pnw = a1.pnw;
			this.pse = a1.pse;
			break;

		case 'arbitrary' :
			throw new Error('TODO');
			break;

		default :
			throw new Error('invalid overload');
	}

	if(
		pnw.x > pse.x ||
		pnw.y > pse.y
	)
	{
		throw Jools.reject('not a rectangle.');
	}

	this.pnw = pnw;
	this.pse = pse;

	Jools.innumerable( this, 'width',  pse.x - pnw.x );
	Jools.innumerable( this, 'height', pse.y - pnw.y );

	this.type = 'Rect'; // FIXME - can this be circumvented?

	Jools.immute( this );
};


/*
| Returns a rectangle thats reduced on every side by a margin object
*/
Rect.prototype.reduce = function( margin )
{
	if( margin.constructor !== Euclid.Margin )
		{ throw new Error( 'margin of wrong type' ); }

	// allows margins to reduce the rect to zero size without erroring.

	return new Rect(
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
Rect.prototype.add = function( a1, a2 )
{
	return new this.constructor(
		'pnw/pse',
		this.pnw.add( a1, a2 ),
		this.pse.add( a1, a2 )
	);
};


/*
| creates a new rect
|
| looks throw a list of additional rects to look for objects to be reused
|
| Rect.renew(wx, ny, ex, sy, ...[rects]... )
*/
Rect.renew = function( wx, ny, ex, sy )
{
	var pnw   = null;
	var pse   = null;
	var isnon = Jools.isnon;
	var a, aZ, r;

	for( a = 4, aZ = arguments.length; a < aZ; a++ )
	{
		r = arguments[ a ];
		if ( !isnon( r ) )
			{ continue; }

		if( r.pnw.x === wx && r.pnw.y === ny )
		{
			if( r.pse.x === ex && r.pse.y === sy )
				{ return r; }

			pnw = r.pnw;
			break;
		}

		if ( r.pse.x === wx && r.pse.y === ny )
		{
			pnw = r.pse;
			break;
		}
	}

	for( a = 4, aZ = arguments.length; a < aZ; a++ )
	{
		r = arguments[ a ];

		if( !isnon( r ) )
			{ continue; }

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
		{ pnw = new Euclid.Point( wx, ny ); }

	if( !pse )
		{ pse = new Euclid.Point( ex, sy ); }

	return new Rect( 'pnw/pse', pnw, pse );
};


/*
| Returns a rect moved by a -point or -x/-y.
|
| sub(point)   -or-
| sub(x, y)
*/
Rect.prototype.sub = function( a1, a2 )
{
	return new this.constructor(
		'pnw/pse',
		this.pnw.sub( a1, a2 ),
		this.pse.sub( a1, a2 )
	);
};


/*
| Returns true if this rectangle is the same as another
*/
Rect.prototype.eq = function( r )
{
	return (
		this.pnw.eq( r.pnw ) &&
		this.pse.eq( r.pse )
	);
};


/*
| Draws the rectangle.
*/
Rect.prototype.sketch = function( fabric, border, twist, view )
{
	var wx = view.x( this.pnw );
	var ny = view.y( this.pnw );
	var ex = view.x( this.pse );
	var sy = view.y( this.pse );

	fabric.moveTo( wx + border, ny + border );
	fabric.lineTo( ex - border, ny + border );
	fabric.lineTo( ex - border, sy - border );
	fabric.lineTo( wx + border, sy - border );
	fabric.lineTo( wx + border, ny + border );
};


/*
| Returns true if point is within this rect.
*/
Rect.prototype.within = function( view, p )
{
	var x   = view.dex( p );
	var y   = view.dey( p );

	var pnw = this.pnw;
	var pse = this.pse;

	return (
		x >= pnw.x &&
		y >= pnw.y &&
		x <= pse.x &&
		y <= pse.y
	);
};


/*
| Returns the point where a ray going from
| pc to p intersects with the rect.
*/
Rect.prototype.getProjection = function( p )
{
	var pc = this.pc;

	var ny = this.pnw.y;
	var ex = this.pse.x;
	var sy = this.pse.y;
	var wx = this.pnw.x;

	var k  = ( p.y - pc.y ) / ( p.x - pc.x );
	var x, y;

	// y = (x - pc.x) * k + pc.y
	// x = (y - pc.y) / k + pc.x

	if( p.y <= ny )
	{
		x = ( ny - pc.y ) / k + pc.x;

		if ( x >= wx && x <= ex )
			{ return new Euclid.Point( x, ny ); }
	}

	if( p.y >= sy )
	{
		x = ( sy - pc.y ) / k + pc.x;

		if( x >= wx && x <= ex )
			{ return new Euclid.Point( x, sy ); }
	}

	if( p.x >= ex )
	{
		y = ( ex - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
			{ return new Euclid.Point( ex, y ); }
	}

	if( p.x <= wx )
	{
		y = ( wx - pc.x ) * k + pc.y;

		if( y >= ny && y <= sy )
			{ return new Euclid.Point( wx, y ); }
	}

	return pc;
};


/*
| Node export
*/
if( typeof( window ) === 'undefined' )
{
	module.exports = Rect;
}

} )( );
