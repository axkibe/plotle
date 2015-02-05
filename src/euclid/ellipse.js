/*
| An ellipse.
*/


var
	euclid_ellipse,
	euclid_point,
	euclid_shape,
	jools,
	shapeSection_round,
	shapeSection_start;


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
		id :
			'euclid_ellipse',
		attributes :
			{
				pnw :
					{
						comment :
							'point in north west',
						type :
							'euclid_point'
					},
				pse :
					{
						comment :
							'point in south east',
						type :
							'euclid_point'
					},
				// FIXME make proper optionals
				gradientPC :
					{
						comment :
							'center for gradient',
						type :
							'euclid_point',
						defaultValue :
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
						defaultValue :
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
						defaultValue :
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


/*
| Initialization.
*/
euclid_ellipse.prototype._init =
	function(
		pnw,
		pse
	)
{
	// cardinal coords
	var
		wx,
		ny,
		ex,
		sy,
		// middles of cardinal cords
		my,
		mx,
		// cardinal points
		pw,
		pn,
		pe,
		ps;

	wx = pnw.x;

	ny = pnw.y;

	ex = pse.x;

	sy = pse.y;

	// middles of cardinal cords
	my = jools.half( ny + sy );

	mx = jools.half(wx + ex);

	// cardinal points
	pw = euclid_point.create( 'x', wx, 'y', my );

	pn = euclid_point.create( 'x', mx, 'y', ny );

	pe = euclid_point.create( 'x', ex, 'y', my );

	ps = euclid_point.create( 'x', mx, 'y', sy );

	this.shape =
		euclid_shape.create(
			'ray:init',
			[
				shapeSection_start.create(
					'p', pw
				),
				shapeSection_round.create(
					'rotation', 'clockwise',
					'p', pn
				),
				shapeSection_round.create(
					'rotation', 'clockwise',
					'p', pe
				),
				shapeSection_round.create(
					'rotation', 'clockwise',
					'p', ps
				),
				shapeSection_round.create(
					'rotation', 'clockwise',
					'close', true
				)
			],
			'pc', this.pc
		);
};


/*
| Center point of an ellipse.
*/
jools.lazyValue(
	euclid_ellipse.prototype,
	'pc',
	function( )
	{
		return(
			euclid_point.create(
				'x', jools.half( this.pnw.x + this.pse.x ),
				'y', jools.half( this.pnw.y + this.pse.y )
			)
		);
	}
);


/*
| Gradient's center point.
*/
jools.lazyValue(
	euclid_ellipse.prototype,
	'gradientPC',
	function( )
	{
		// FIXME this is just a workaround
		if( this._gradientPC )
		{
			return this._gradientPC;
		}

		return(
			euclid_point.create(
				'x', jools.half( this.pnw.x + this.pse.x ),
				'y', jools.half( this.pnw.y + this.pse.y )
			)
		);
	}
);


/*
| Gradient inner radius.
*/
jools.lazyValue(
	euclid_ellipse.prototype,
	'gradientR1',
	function( )
	{
		var
			dx,
			dy;

		// FIXME this is just a workaround
		if( this._gradientR1 )
		{
			return this._gradientR1;
		}

		dx = this.pse.x - this.pnw.x;

		dy = this.pse.y - this.pnw.y;

		return Math.max( dx, dy );
	}
);


/*
| Gradient inner radius.
*/
jools.lazyValue(
	euclid_ellipse.prototype,
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
| Returns true if point is within the ellipse.
*/
euclid_ellipse.prototype.within =
	function
	(
		view,
		p
	)
{
	var
		pp;

	pp = view.depoint( p );

	if(
		pp.x < this.pnw.x
		|| pp.y < this.pnw.y
		|| pp.x > this.pse.x
		|| pp.y > this.pse.y
	)
	{
		return false;
	}

	return this.shape.within( view, p);
};


/*
| Gets the source of a projection to p.
*/
euclid_ellipse.prototype.getProjection =
	function
	(
		// ...
	)
{
	return this.shape.getProjection.apply( this.shape, arguments );
};


} )( );

