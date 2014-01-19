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
	Jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition
*/
if( JOOBJ )
{
	return {

		name :
			'Ellipse',

		unit :
			'Euclid',

		attributes :
			{
				pnw :
					{
						comment :
							'point in north west',

						type :
							'Point'
					},

				pse :
					{
						comment :
							'point in south east',

						type :
							'Point'
					},

				// FIXME make proper optionals
				gradientPC :
					{
						comment :
							'center for gradient',

						type :
							'Point',

						allowNull :
							true,

						defaultVal :
							'null',

						assign :
							'_gradientPC'
					},


				gradientR0 :
					{
						comment :
							'inner radius for circle gradients',

						type :
							'Number',

						allowNull :
							true,

						defaultVal :
							'null',

						assign :
							'_gradientR0'
					},

				gradientR1 :
					{
						comment :
							'outer radius for circle gradients',

						type :
							'Number',

						allowNull :
							true,

						defaultVal :
							'null',

						assign :
							'_gradientR1'
					}
			},

		init :
			[
				'pnw',
				'pse'
			]
	};
}


var
	Ellipse =
		Euclid.Ellipse;


/*
| Initialization.
*/
Ellipse.prototype._init =
	function(
		pnw,
		pse
	)
{
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
			Euclid.Point.create( 'x', wx, 'y', my ),

		pn =
			Euclid.Point.create( 'x', mx, 'y', ny ),

		pe =
			Euclid.Point.create( 'x', ex, 'y', my ),

		ps =
			Euclid.Point.create( 'x', mx, 'y', sy );

	this.shape =
		new Euclid.Shape(
			[
				'start',
					pw,
				'round',
					'clockwise',
					pn,
				'round',
					'clockwise',
					pe,
				'round',
					'clockwise',
					ps,
				'round',
					'clockwise',
					'close'
			],
			this.pc
		);
};


/*
| Center point of an ellipse.
*/
Jools.lazyFixate(
	Ellipse.prototype,
	'pc',
	function()
	{
		return (
			Euclid.Point.create(
				'x',
					Jools.half(
						this.pnw.x + this.pse.x
					),
				'y',
					Jools.half(
						this.pnw.y + this.pse.y
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
	function( )
	{
		// FIXME this is just a workaround
		if( this._gradientPC )
		{
			return this._gradientPC;
		}

		return (
			Euclid.Point.create(
				'x',
					Jools.half(
						this.pnw.x + this.pse.x
					),
				'y',
					Jools.half(
						this.pnw.y + this.pse.y
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
		// FIXME this is just a workaround
		if( this._gradientR1 )
		{
			return this._gradientR1;
		}

		var
			dx =
				this.pse.x - this.pnw.x;

		var
			dy =
				this.pse.y - this.pnw.y;

		return Math.max(
			dx,
			dy
		);
	}
);


/*
| Gradient radius
*/
Jools.lazyFixate(
	Ellipse.prototype,
	'gradientR0',
	function( )
	{
		// FIXME this is just a workaround
		if( this._gradientR0 )
		{
			return this._gradientR0;
		}

		return 0;
	}
);


Ellipse.prototype.sketch =
	function
	(
		// ...
	)
{
	return this.shape.sketch.apply(
		this.shape,
		arguments
	);
};


Ellipse.prototype.within =
	function
	(
		view,
		p
	)
{
	var
		pp =
			view.depoint( p );

	if(
		p.x < this.pnw.x ||
		p.y < this.pnw.y ||
		p.x > this.pse.x ||
		p.y > this.pse.y
	)
	{
		return false;
	}

	return this.shape.within(
		view,
		p
	);
};


Ellipse.prototype.getProjection =
	function
	(
		// ...
	)
{
	return this.shape.getProjection.apply(
		this.shape,
		arguments
	);
};


} )( );

