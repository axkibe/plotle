/*
| An ellipse.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Euclid;
Euclid =
	Euclid || { };


/*
| Imports
*/
var
	Jools,
	shellverse;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser'
	);
}

/*
| Constructor.
*/
var Ellipse =
Euclid.Ellipse =
	function(
		pnw, // point in north-west
		pse  // point in south-east
		// ...
	)
{
	this.pnw =
		pnw;

	this.pse =
		pse;

	// cardinal coords
	var
		wx =
			pnw.x,

		ny =
			pnw.y,

		ex =
			pse.x,

		sy =
			pse.y,

		// middles of cardinal cords
		my =
			Jools.half( ny + sy ),

		mx =
			Jools.half(wx + ex),

		// cardinal points
		pw =
			shellverse.grow(
				'Point',
				'x',
					wx,
				'y',
					my
			),

		pn =
			shellverse.grow(
				'Point',
				'x',
					mx,
				'y',
					ny
			),

		pe =
			shellverse.grow(
				'Point',
				'x',
					ex,
				'y',
					my
			),

		ps =
			shellverse.grow(
				'Point',
				'x',
					mx,
				'y',
					sy
			);


	Euclid.Shape.call(
		this,
		[
			'start', pw,
			'round', 'clockwise', pn,
			'round', 'clockwise', pe,
			'round', 'clockwise', ps,
			'round', 'clockwise', 'close'
		]
	);

	for(
		var a = 2, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		var
			arg =
				arguments[ a ],

			val =
				arguments[ a + 1 ];

		switch( arg )
		{
			case 'gradientPC' :

				this._lazy_gradientPC = val;

				break;

			case 'gradientR0' :

				this._lazy_gradientR0 = val;

				break;

			case 'gradientR1' :

				this._lazy_gradientR1 = val;

				break;

			default :
				throw new Error( 'invalid argument: ' + arg );
		}
	}

	Jools.immute(this);
};


Jools.subclass(
	Ellipse,
	Euclid.Shape
);


/*
| Center point of an ellipse.
*/
Jools.lazyFixate(
	Ellipse.prototype,
	'pc',
	function()
	{
		return (
			shellverse.grow(
				'Point',
				'x',
					Jools.half(
						this.pnw.x +
						this.pse.x
					),
				'y',
					Jools.half(
						this.pnw.y +
						this.pse.y
					)
			)
		);
	}
);


/*
| gradient's center point
*/
Jools.lazyFixate(
	Ellipse.prototype,
	'gradientPC',
	function()
	{
		return (
			shellverse.grow(
				'Point',
				'x',
					Jools.half(
						this.pnw.x +
						this.pse.x
					),
				'y',
					Jools.half(
						this.pnw.y +
						this.pse.y
					)
			)
		);
	}
);


/*
| Gradient radius
*/
Jools.lazyFixate(
	Ellipse.prototype,
	'gradientR1',
	function( )
	{
		var dx =
			this.pse.x - this.pnw.x;

		var dy =
			this.pse.y - this.pnw.y;

		return Math.max(
			dx,
			dy
		);
	}
);

/*
| Returns true if this ellipse is the same as another
*/
Ellipse.prototype.equals =
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
| Returns true if point is within the ellipse.
|
| TODO this should be inherited by Shape.
*/
Ellipse.prototype.within =
	function(
		view,
		p
	)
{
	return Euclid.swatch.withinSketch(
		this,
		'sketch',
		view,
		p
	);
};


} )( );

