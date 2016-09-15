/*
| A point in a 2D plane.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'euclid_point',
		attributes :
		{
			x :
			{
				comment : 'x coordinate',
				json : true,
				type : 'number'
			},
			y :
			{
				comment : 'y coordinate',
				json : true,
				type : 'number'
			}
		}
	};
}


var
	euclid_anchor_point,
	euclid_point,
	euclid_rect,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


var prototype;


if( NODE )
{
	jion = require( 'jion' );

	euclid_point = jion.this( module, 'source' );
}

prototype = euclid_point.prototype;


/*
| Returns a point aligned to rounded coords.
|
| FIXME should not be needed.
*/
jion.lazyValue(
	prototype,
	'align',
	function( )
{
	return(
		this.create(
			'x', Math.round( this.x ),
			'y', Math.round( this.y )
		)
	);
}
);


/*
| Returns a border bordering this point.
| See euclid_shape.border for further explanation.
*/
prototype.border =
	function(
		pc,  // center point to border relatively to
		d    // distance to border
	)
{
	var
		cx,
		cy,
		x,
		y;

	x = this.x;

	y = this.y;

	cx = pc.x;

	cy = pc.y;

	return(
		this.create(
			'x',
				x +
				(
					x > cx
					?  -d
					: ( x < cx ? d : 0 )
				),
			'y',
				y +
				(
					y > cy
					?  -d
					: ( y < cy ? d : 0 )
				)
		)
	);
};


/*
| Adds two points or x/y values, returns a new point.
|
| FIXME; change to multiple point adding
*/
prototype.add =
	function(
		a1,
		a2
	)
{
	if( typeof( a1 ) === 'object' )
	{
		if( a1.x === 0 && a1.y === 0 )
		{
			return this;
		}

		return euclid_point.create(
			'x', this.x + a1.x,
			'y', this.y + a1.y
		);
	}
	else
	{
/**/	if( CHECK )
/**/	{
/**/		if( arguments.length !== 2 ) throw new Error( );
/**/	}

		if( a1 === 0 && a2 === 0 ) return this;

		return euclid_point.create(
			'x', this.x + a1,
			'y', this.y + a2
		);
	}
};



/*
| Creates a rect of size width*height with this
| point as pnw.
*/
prototype.createRectOfSize =
	function(
		width,
		height
	)
{
	return(
		euclid_rect.create(
			'pnw', this,
			'pse', this.add( width, height )
		)
	);
};


/*
| Returns the original position of repositioned point.
*/
prototype.fromView =
	function(
		view
	)
{
	return(
		this.create(
			'x', view.dex( this.x ),
			'y', view.dey( this.y )
		)
	);
};


/*
| Returns the point transformed back by a view.
|
| FIXME remove as double to fromView
*/
prototype.deView =
	function(
		view
	)
{
	return(
		this.create(
			'x', view.dex( this.x ),
			'y', view.dey( this.y )
		)
	);
};


/*
| Returns this point scaled by
| scaleX, scaleY relative to the base point.
*/
prototype.intercept =
	function(
		base,
		scaleX,
		scaleY
	)
{
	var
		x,
		y,
		bx,
		by;

	if( scaleX === 1 && scaleY === 1 ) return this;

	x = this.x;

	y = this.y;

	bx = base.x;

	by = base.y;

	if( x === bx && y === by ) return this;

	return(
		this.create(
			'x', ( x - bx ) * scaleX + bx,
			'y', ( y - by ) * scaleY + by
		)
	);
};


/*
| Returns the point repositioned to a view.
*/
prototype.inView =
	function(
		view
	)
{
	return(
		this.create(
			'x', view.x( this.x ),
			'y', view.y( this.y )
		)
	);
};


/*
| Returns a point which x/y values are snapped to the nearest
| whole number.
*/
jion.lazyValue(
	prototype,
	'snapRound',
	function( )
{
	var
		x,
		xSnap,
		y,
		ySnap;

	x = this.x;

	y = this.y;

	xSnap = Math.round( x );

	ySnap = Math.round( y );

	if( x === xSnap && y === ySnap ) return this;

	return(
		this.create(
			'x', xSnap,
			'y', ySnap
		)
	);
}
);


/*
| Subtracts a points (or x/y from this), returns new point
*/
prototype.sub =
	function(
		a1,
		a2
	)
{
	if( typeof( a1 ) === 'object' )
	{
		if( a1.x === 0 && a1.y === 0 )
		{
			return this;
		}

		return euclid_point.create(
			'x', this.x - a1.x,
			'y', this.y - a1.y
		);
	}
	else
	{
		if( a1 === 0 && a2 === 0 )
		{
			return this;
		}

		return euclid_point.create(
			'x', this.x - a1,
			'y', this.y - a2
		);
	}
};


/*
| Returns this euclidean point as 'nw' anchored point.
|
| FIXME XXX REMOVE
*/
jion.lazyValue(
	prototype,
	'apnw',
	function( )
{
	return(
		euclid_anchor_point.nw.create(
			'x', this.x,
			'y', this.y
		)
	);
}
);


/*
| Returns this euclidean point as 'center' anchored point.
*/
jion.lazyValue(
	prototype,
	'apc',
	function( )
{
	return(
		euclid_anchor_point.c.create(
			'x', this.x,
			'y', this.y
		)
	);
}
);


/*
| Shortcut for point at 0/0.
*/
euclid_point.zero =
	euclid_point.create( 'x', 0, 'y', 0 );


} )( );
