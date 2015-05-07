/*
| An ellipse.
*/


var
	euclid_ellipse,
	euclid_point,
	euclid_shape,
	euclid_shape_round,
	euclid_shape_start,
	euclid_view,
	jion,
	math_half;


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
	return{
		id : 'euclid_ellipse',
		attributes :
		{
			pnw :
			{
				comment : 'point in north west',
				type : 'euclid_point'
			},
			pse :
			{
				comment : 'point in south east',
				type : 'euclid_point'
			},
			gradientPC :
			{
				comment : 'center for gradient',
				type : [ 'undefined', 'euclid_point' ],
				assign : '_gradientPC'
			},
			gradientR0 :
			{
				comment : 'inner radius for circle gradients',
				type : [ 'undefined', 'number' ],
				assign : '_gradientR0'
			},
			gradientR1 :
			{
				comment : 'outer radius for circle gradients',
				type : [ 'undefined', 'number' ],
				assign : '_gradientR1'
			}
		},
		init : [ 'pnw', 'pse' ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_ellipse.prototype;


/*
| Initialization.
*/
prototype._init =
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
	my = math_half( ny + sy );

	mx = math_half(wx + ex);

	// cardinal points
	pw = euclid_point.create( 'x', wx, 'y', my );

	pn = euclid_point.create( 'x', mx, 'y', ny );

	pe = euclid_point.create( 'x', ex, 'y', my );

	ps = euclid_point.create( 'x', mx, 'y', sy );

	this.shape =
		euclid_shape.create(
			'ray:init',
			[
				euclid_shape_start.create( 'p', pw ),
				euclid_shape_round.create(
					'rotation', 'clockwise',
					'p', pn
				),
				euclid_shape_round.create(
					'rotation', 'clockwise',
					'p', pe
				),
				euclid_shape_round.create(
					'rotation', 'clockwise',
					'p', ps
				),
				euclid_shape_round.create(
					'rotation', 'clockwise',
					'close', true
				)
			],
			'pc', this.pc
		);
};


/*
| Gets the source of a projection to p.
*/
prototype.getProjection =
	function
	(
		// ...
	)
{
	return this.shape.getProjection.apply( this.shape, arguments );
};


/*
| Gradient's center point.
*/
jion.lazyValue(
	prototype,
	'gradientPC',
	function( )
	{
		if( this._gradientPC )
		{
			return this._gradientPC;
		}

		return(
			euclid_point.create(
				'x', math_half( this.pnw.x + this.pse.x ),
				'y', math_half( this.pnw.y + this.pse.y )
			)
		);
	}
);


/*
| Gradient inner radius.
*/
jion.lazyValue(
	prototype,
	'gradientR1',
	function( )
	{
		var
			dx,
			dy;

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
jion.lazyValue(
	prototype,
	'gradientR0',
	function( )
	{
		if( this._gradientR0 )
		{
			return this._gradientR0;
		}

		return 0;
	}
);


/*
| Ellipse height.
*/
jion.lazyValue(
	prototype,
	'height',
	function( )
	{
		return this.pse.y - this.pnw.y;
	}
);


/*
| Center point of an ellipse.
*/
jion.lazyValue(
	prototype,
	'pc',
	function( )
	{
		return(
			euclid_point.create(
				'x', math_half( this.pnw.x + this.pse.x ),
				'y', math_half( this.pnw.y + this.pse.y )
			)
		);
	}
);


/*
| Returns true if point is within the ellipse.
*/
prototype.within =
	function(
		view,  // FIXME
		p
	)
{
	var
		pp;

	if( arguments.length === 1 )
	{
		p = view;

		view = euclid_view.proper;
	}

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
| Ellipse width.
*/
jion.lazyValue(
	prototype,
	'width',
	function( )
	{
		return this.pse.x - this.pnw.x;
	}
);


} )( );

