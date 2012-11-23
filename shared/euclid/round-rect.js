/*
|
| A rectangle with rounded corners.
|
| RoundRects are immutable objects.
|
|      <-> a
|      | |
| pnw  +.------------------.  - - A
|      .                    . _ _ V b
|      |                    |
|      |                    |
|      |                    |
|      '                    '
|       `------------------'+ pse
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

/*
| Capsule
*/
( function() {
'use strict';


/*
| Node imports
*/
if (typeof(window) === 'undefined')
{
	Euclid = {
		Point  : require('./point'),
		Rect   : require('./rect')
	};

	Jools  = require('../jools');
}


/*
| Constructor.
|
| RoundRect(rect, a, b)      -or-
| RoundRect(pnw, pse, a, b)
*/
var RoundRect = Euclid.RoundRect = function(a1, a2, a3, a4)
{
	var pnw, pse, a, b;

	if (a1.constructor === Euclid.Point)
	{
		this.pnw = pnw = a1;
		this.pse = pse = a2;
		a = a3;
		b = a4;
	}
	else
	{
		this.pnw = pnw = a1.pnw;
		this.pse = pse = a1.pse;
		a = a2;
		b = a3;
	}

	pse = pse.sub( 1, 1 );

	var pne = new Euclid.Point( pse.x, pnw.y );
	var psw = new Euclid.Point( pnw.x, pse.y );

	Jools.innumerable(this, 'width',  pse.x - pnw.x + 1);
	Jools.innumerable(this, 'height', pse.y - pnw.y + 1);

	Euclid.Shape.call(
		this,
		[
			'start' ,              pnw.add( 0 , b ),
			'round' , 'clockwise', pnw.add( a , 0 ),
			'line'  ,              pne.sub( a , 0 ),
			'round' , 'clockwise', pne.add( 0 , b ),
			'line'  ,              pse.sub( 0 , b ),
			'round' , 'clockwise', pse.sub( a , 0 ),
			'line'  ,              psw.add( a , 0 ),
			'round' , 'clockwise', psw.sub( 0 , b ),
			'line'  ,             'close'
		]
	);
};
Jools.subclass( RoundRect, Euclid.Shape );


/*
| point in the center
*/
Jools.lazyFixate(RoundRect.prototype, 'pc',
	function( )
	{
		return new Euclid.Point(
			Jools.half( this.pse.x + this.pnw.x ),
			Jools.half( this.pse.y + this.pnw.y )
		);
	}
);


/*
| Returns true if this rectangle is the same as another
*/
RoundRect.prototype.eq = function( r )
{
	return (
		this.pnw.eq( r.pnw ) &&
		this.pse.eq( r.pse )
	);
};


/*
| returns true if point p is within the round-rect
| TODO put into Shape
*/
RoundRect.prototype.within = function( view, p )
{
	return Euclid.swatch.withinSketch(
		this,
		'sketch',
		view,
		p
	);
};

} ) ( );
