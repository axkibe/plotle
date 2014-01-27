/*
| A view on a space determines the current
| pan, zooming and viewport (size of screen)
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
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {

		name :
			'View',

		unit :
			'Euclid',

		attributes :
			{
				fact :
					{
						comment :
							'zooming factor of view',

						type :
							'Number'
					},

				height :
					{
						comment :
							'current height of screen',

						type :
							'Integer'
					},

				pan :
					{
						comment :
							'point in north west (equals panning)',

						type :
							'Point'
					},

				width :
					{
						comment :
							'current width of screen',

						type :
							'Integer'
					}
			},

		init :
			[ ]
	};
}


var
	View =
		Euclid.View;

/*
| Initializer.
*/
View.prototype._init =
	function( )
{
	this.fact =
		Jools.limit(
			theme.zoom.min,
			this.fact,
			theme.zoom.max
		);

	this.zoom =
		Math.pow(
			theme.zoom.base,
			this.fact
		);
};


/*
| Returns the scaled distance of d
*/
View.prototype.scale =
	function(
		d
	)
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
		x =
			a1.x;

		y =
			a1.y;
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
		( x + this.pan.x ) * this.zoom
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
		x =
			a1.x;

		y =
			a1.y;
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
		x =
			a1.x;

		y =
			a1.y;
	}
	else
	{
		if(
			typeof( a1 ) !== 'number' ||
			typeof( a2 ) !== 'number'
		)
		{
			throw new Error(
				'not a number'
			);
		}

		x =
			a1;

		y =
			a2;
	}

	return Math.round(
		( y + this.pan.y ) * this.zoom
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
	var
		x, y;

	if( a1 instanceof Euclid.Point )
	{
		x =
			a1.x;

		y =
			a1.y;
	}
	else
	{
		if(
			typeof( a1 ) !== 'number' ||
			typeof( a2 ) !== 'number'
		)
		{
			throw new Error(
				'not a number'
			);
		}

		x =
			a1;

		y =
			a2;
	}

	return Math.round(
		y / this.zoom - this.pan.y
	);
};


/*
| Returns a view with pan zero, but same fact level
*/
Jools.lazyFixate(
	View.prototype,
	'home',
	function( )
	{
		return (
			View.create(
				'inherit',
					this,
				'pan',
					Euclid.Point.zero
			)
		);
	}
);



/*
| Returns a view with pan zero and fact zero
*/
Jools.lazyFixate(
	View.prototype,
	'sizeOnly',
	function( )
	{
		return (
			View.create(
				'inherit',
					this,
				'pan',
					Euclid.Point.zero,
				'fact',
					0
			)
		);
	}
);


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

		return (
			Euclid.Point.create(
				'x',
					this.x( a1 ),
				'y',
					this.y( a1 )
			)
		);
	}

	return (
		Euclid.Point.create(
			'x',
				this.x( a1, a2 ),
			'y',
				this.y( a1, a2 )
		)
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
		Euclid.Point.create(
			'x',
				this.dex( a1, a2 ),
			'y',
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
	if( this.zoom === 1 )
	{
		var
			r =
				(a1 instanceof Euclid.Rect) ?
					a1 :
					Euclid.Rect.create(
						'pnw',
							a1,
						'pse',
							a2
					);

		return (
			( this.pan.x === 0 && this.pan.y === 0 )
			?
			r
			:
			r.add( this.pan )
		);
	}

	var
		pnw,
		pse;

	if( a1 instanceof Euclid.Rect )
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
		'pnw',
			this.point( pnw ),
		'pse',
			this.point( pse )
	);
};


/*
| Returns a view with changed zoom level and
| a pnw so p stays in the same spot.
|
| new pnw (k1) calculates as:
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
	var
		pan =
			this.pan,

		f1;

	if( df === 0 )
	{
		f1 =
			0;
	}
	else
	{
		f1 =
			Jools.limit(
				theme.zoom.min,
				this.fact + df,
				theme.zoom.max
			);
	}

	var
		z1 =
			Math.pow( 1.1, f1 ),

		f =
			1 / z1
			-
			1 / this.zoom;

	return View.create(
		'inherit',
			this,
		'fact',
			f1,
		'pan',
			Euclid.Point.create(
				'x',
					Math.round( pan.x + p.x * f ),
				'y',
					Math.round( pan.y + p.y * f )
			)
	);
};


/*
| Proper is the view at point zero with zero zoom.
|
| TODO remove
*/
View.proper =
	View.create(
		'height',
			0,
		'fact',
			0,
		'pan',
			Euclid.Point.zero,
		'width',
			0
	);


} )( );
