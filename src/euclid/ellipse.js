/*
| An ellipse.
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
| The jion definition
*/
if( JION )
{
	return {
		name :
			'ellipse',
		unit :
			'euclid',
		attributes :
			{
				pnw :
					{
						comment :
							'point in north west',
						type :
							'point'
					},
				pse :
					{
						comment :
							'point in south east',
						type :
							'point'
					},
				// FIXME make proper optionals
				gradientPC :
					{
						comment :
							'center for gradient',
						type :
							'point',
						defaultValue :
							null,
						assign :
							'_gradientPC'
					},
				gradientR0 :
					{
						comment :
							'inner radius for circle gradients',
						type :
							'Number',
						defaultValue :
							null,
						assign :
							'_gradientR0'
					},
				gradientR1 :
					{
						comment :
							'outer radius for circle gradients',
						type :
							'Number',
						defaultValue :
							null,
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
	ellipse;

ellipse = euclid.ellipse;


/*
| Initialization.
*/
ellipse.prototype._init =
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
			jools.half( ny + sy ),

		mx =
			jools.half(wx + ex),

		// cardinal points
		pw =
			euclid.point.create( 'x', wx, 'y', my ),

		pn =
			euclid.point.create( 'x', mx, 'y', ny ),

		pe =
			euclid.point.create( 'x', ex, 'y', my ),

		ps =
			euclid.point.create( 'x', mx, 'y', sy );

	this.shape =
		euclid.shape.create(
			'hull',
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
			'pc',
				this.pc
		);
};


/*
| Center point of an ellipse.
*/
jools.lazyValue(
	ellipse.prototype,
	'pc',
	function()
	{
		return (
			euclid.point.create(
				'x',
					jools.half(
						this.pnw.x + this.pse.x
					),
				'y',
					jools.half(
						this.pnw.y + this.pse.y
					)
			)
		);
	}
);


/*
| Gradient's center point.
*/
jools.lazyValue(
	ellipse.prototype,
	'gradientPC',
	function( )
	{
		// FIXME this is just a workaround
		if( this._gradientPC )
		{
			return this._gradientPC;
		}

		return (
			euclid.point.create(
				'x',
					jools.half(
						this.pnw.x + this.pse.x
					),
				'y',
					jools.half(
						this.pnw.y + this.pse.y
					)
			)
		);
	}
);


/*
| Gradient inner radius.
*/
jools.lazyValue(
	ellipse.prototype,
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
| Gradient inner radius.
*/
jools.lazyValue(
	ellipse.prototype,
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


/*
| Draws the ellipse.
*/
ellipse.prototype.sketch =
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


/*
| Returns true if point is within the ellipse.
*/
ellipse.prototype.within =
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
		pp.x < this.pnw.x ||
		pp.y < this.pnw.y ||
		pp.x > this.pse.x ||
		pp.y > this.pse.y
	)
	{
		return false;
	}

	return this.shape.within(
		view,
		p
	);
};


/*
| Gets the source of a projection to p.
*/
ellipse.prototype.getProjection =
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

