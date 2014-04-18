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
		x
	)
{
/**/if( CHECK )
/**/{
/**/	if(
/**/		typeof( x ) !== 'number'
/**/		||
/**/		arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error(
/**/			'arg fail'
/**/		);
/**/	}
/**/}

	return Math.round(
		( x + this.pan.x ) * this.zoom
	);
};


/*
| Returns the original x value for a point in this view.
*/
View.prototype.dex =
	function(
		x
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		typeof( x ) !== 'number'
/**/		||
/**/		arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error(
/**/			'arg fail'
/**/		);
/**/	}
/**/}

	return Math.round(
		x / this.zoom - this.pan.x
	);
};


/*
| Returns the y value for a point for this view.
*/
View.prototype.y =
	function(
		y
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		typeof( y ) !== 'number'
/**/		||
/**/		arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error(
/**/			'arg fail'
/**/		);
/**/	}
/**/}

	return Math.round(
		( y + this.pan.y ) * this.zoom
	);
};


/*
| Returns the original y value for a point in this view.
*/
View.prototype.dey =
	function(
		y
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		typeof( y ) !== 'number'
/**/		||
/**/		arguments.length !== 1
/**/	)
/**/	{
/**/		throw new Error(
/**/			'arg fail'
/**/		);
/**/	}
/**/}

	return Math.round(
		y / this.zoom - this.pan.y
	);
};


/*
| A view with pan zero, but same fact level
|
| FUTURE remove?
*/
Jools.lazyValue(
	View.prototype,
	'home',
	function( )
	{
		return (
			this.Create(
				'pan',
					Euclid.Point.zero
			)
		);
	}
);



/*
| A view with pan zero and fact zero
*/
Jools.lazyValue(
	View.prototype,
	'sizeOnly',
	function( )
	{
		return (
			this.Create(
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
		p
	)
{

/**/if( CHECK )
/**/{
/**/	if( p.reflect !== 'Point' )
/**/	{
/**/		throw new Error(
/**/			'invalid arg'
/**/		);
/**/	}
/**/}

	if (
		this.zoom === 1
		&&
		this.pan.x === 0
		&&
		this.pan.y === 0
	)
	{
		return p;
	}

	return (
		Euclid.Point.Create(
			'x',
				this.x( p.x ),
			'y',
				this.y( p.y )
		)
	);
};


/*
| Returns the original position of repositioned point.
*/
View.prototype.depoint =
	function(
		p
	)
{

/**/if( CHECK )
/**/{
/**/	if( p.reflect !== 'Point' )
/**/	{
/**/		throw new Error(
/**/			'invalid arg'
/**/		);
/**/	}
/**/}

	return (
		Euclid.Point.Create(
			'x',
				this.dex( p.x ),
			'y',
				this.dey( p.y )
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
					Euclid.Rect.Create(
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

	return Euclid.Rect.Create(
		'pnw',
			this.point( pnw ),
		'pse',
			this.point( pse )
	);
};


/*
| Returns a view with changed zoom level and
| a pan so p stays in the same spot.
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

	return this.Create(
		'fact',
			f1,
		'pan',
			Euclid.Point.Create(
				'x',
					Math.round( pan.x + p.x * f ),
				'y',
					Math.round( pan.y + p.y * f )
			)
	);
};


/*
| The zero based frame of this view.
*/
Jools.lazyValue(
	View.prototype,
	'baseFrame',
	function( )
	{
		return (
			Euclid.Rect.Create(
				'pnw',
					Euclid.Point.zero,
				'pse',
					Euclid.Point.Create(
						'x',
							this.width,
						'y',
							this.height
					)
			)
		);
	}
);


/*
| Proper is the view at point zero with zero zoom.
|
| FIXME remove
*/
View.proper =
	View.Create(
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
