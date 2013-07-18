/*
| A view on a space determines the current pan,
| zooming and a possible ongoing pan/zooming motion.
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
	shellverse,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
*/
var View =
Euclid.View =
	function(
		pan,
		fact
	)
{
	this.pan =
		pan;

	this.fact =
		Jools.limit(
			theme.zoom.min,
			fact,
			theme.zoom.max
		);

	this.zoom =
		Math.pow(
			theme.zoom.base,
			this.fact
		);

	Jools.immute( this );
};


/*
| Returns true if this view equals another
*/
View.prototype.eq =
	function( a1 )
{
	return (
		(a1 instanceof View) &&
		this.zoom === a1.zoom &&
		this.pan.eq(a1.pan)
	);
};


/*
| Returns the zoomed distance d
| TODO rename to scale
*/
View.prototype.distance =
	function( d )
{
	return this.zoom * d;
};


/*
| Returns the x value for a point for this view.
*/
View.prototype.x =
	function(
		a1,
		a2
	)
{
	var x, y;

	if( a1 instanceof Euclid.Point )
	{
		x = a1.x;
		y = a1.y;
	}
	else
	{
		if(
			typeof( a1 ) !== 'number' ||
			typeof( a2 ) !== 'number'
		)
		{
			throw new Error( 'not a number' );
		}

		x = a1;
		y = a2;
	}

	return Math.round(
		(x + this.pan.x) * this.zoom
	);
};


/*
| Returns the original x value for a point in this view.
*/
View.prototype.dex =
	function(
		a1,
		a2
	)
{
	var x, y;

	if( a1 instanceof Euclid.Point )
	{
		x = a1.x;
		y = a1.y;
	}
	else
	{
		if (typeof(a1) !== 'number' || typeof(a2) !== 'number')
			{ throw new Error('not a number'); }

		x = a1;
		y = a2;
	}

	return Math.round(
		x / this.zoom - this.pan.x
	);
};


/*
| Returns the y value for a point for this view.
*/
View.prototype.y =
	function(
		a1,
		a2
	)
{
	var x, y;

	if( a1 instanceof Euclid.Point )
	{
		x = a1.x;
		y = a1.y;
	}
	else
	{
		if(
			typeof( a1 ) !== 'number' ||
			typeof( a2 ) !== 'number'
		)
		{
			throw new Error( 'not a number' );
		}

		x = a1;
		y = a2;
	}

	return Math.round(
		(y + this.pan.y) * this.zoom
	);
};


/*
| Returns the original y value for a point in this view.
*/
View.prototype.dey =
	function(
		a1,
		a2
	)
{
	var x, y;

	if( a1 instanceof Euclid.Point )
	{
		x = a1.x;
		y = a1.y;
	}
	else
	{
		if(
			typeof( a1 ) !== 'number' ||
			typeof( a2 ) !== 'number'
		)
		{
			throw new Error( 'not a number' );
		}

		x = a1;
		y = a2;
	}

	return Math.round(
		y / this.zoom - this.pan.y
	);
};


/*
| Returns a view with pan zero, but same zero level
*/
View.prototype.home =
	function( )
{
	if( this._$home )
	{
		return this._$home;
	}

	var home =
	this._$home =
		new View(
			Euclid.Point.zero,
			this.fact
		);

	return home;
};


/*
| Returns a point repositioned to the current view.
*/
View.prototype.point =
	function(
		a1,
		a2
	)
{
	if( a1 instanceof Euclid.Point )
	{
		if (
			this.zoom === 1 &&
			this.pan.x === 0 &&
			this.pan.y === 0
		)
		{
			return a1;
		}

		return Tree.grow(
			'Point',
			shellverse,
			'x',
				this.x( a1 ),
			'y',
				this.y( a1 )
		);
	}

	return new Euclid.Point(
		this.x( a1, a2 ),
		this.y( a1, a2 )
	);
};


/*
| Returns the original position of repositioned point.
*/
View.prototype.depoint =
	function(
		a1,
		a2
	)
{
	return (
		new Euclid.Point(
			this.dex( a1, a2 ),
			this.dey( a1, a2 )
		)
	);
};


/*
| Returns a rect repositioned and resized to the current view.
*/
View.prototype.rect =
	function(
		a1,
		a2
	)
{
	if (this.zoom === 1) {

		var
			r =
				(a1 instanceof Euclid.Rect) ?
					a1 :
					Euclid.Rect.create(
						'pnw/pse',
						a1,
						a2
					);

		return (
			(this.pan.x === 0 && this.pan.y === 0) ?
			r :
			r.add( this.pan )
		);
	}

	var
		pnw,
		pse;

	if (a1 instanceof Euclid.Rect)
	{
		pnw =
			a1.pnw;

		pse =
			a1.pse;
	}
	else
	{
		pnw =
			a1;

		pse =
			a2;
	}

	return Euclid.Rect.create(
		'pnw/pse',
		this.point( pnw ),
		this.point( pse )
	);
};


/*
| Returns a view with changes zoom level and a pan so p stays in the same spot.
|
| new pan (k1) calculates as:
|
| A: p = (y0 + k1) * z1
| B: p = (y0 + k0) * z0
|
| A: p / z1 = y0 + k1
| B: p / z0 = y0 + k0
|
| A - B: p / z1 - p / z0 = k1 - k0
|
| -> k1 = p *(1 / z1 - 1 / z0) + k0
*/
View.prototype.review =
	function(
		df,
		p
	)
{
	var pan = this.pan;
	var f1;

	if (df === 0)
		{ f1 = 0; }
	else
		{ f1 = Jools.limit( theme.zoom.min, this.fact + df, theme.zoom.max); }

	var z1 = Math.pow(1.1, f1);
	var f = 1 / z1  - 1 / this.zoom;

	return new View(
		new Euclid.Point(
			Math.round( pan.x + p.x * f ),
			Math.round( pan.y + p.y * f )
		),
		f1
	);
};


/*
| Proper is the view at point zero with zero zoom.
*/
View.proper =
	new View(
		Euclid.Point.zero,
		0
	);

} )( );
