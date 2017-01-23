/*
| A point in a 2D plane.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_point',
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
	gleam_point,
	gleam_rect,
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

	gleam_point = jion.this( module, 'source' );
}

prototype = gleam_point.prototype;


/*
| Shortcut to create x/y.
*/
gleam_point.xy =
	function(
		x,
		y
	)
{
	return(
		gleam_point.create(
			'x', x,
			'y', y
		)
	);
};


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
| See gleam_shape.border for further explanation.
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

		return gleam_point.create(
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

		return gleam_point.create(
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
		gleam_rect.create(
			'pnw', this,
			'pse', this.add( width, height )
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
| Returns a transformed point.
*/
prototype.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.reflect !== 'gleam_transform' ) throw new Error( );
/**/}

	return(
		transform.zoom === 1
		? this.add( transform.offset )
		: this.create(
			'x', transform.x( this.x ),
			'y', transform.y( this.y )
		)
	);
};


/*
| Returns a detransformed point.
*/
prototype.detransform =
	function(
		transform
	)
{
	return(
		this.create(
			'x', transform.dex( this.x ),
			'y', transform.dey( this.y )
		)
	);
};


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
		if( a1.x === 0 && a1.y === 0 ) return this;

		return gleam_point.create(
			'x', this.x - a1.x,
			'y', this.y - a1.y
		);
	}
	else
	{
		if( a1 === 0 && a2 === 0 ) return this;

		return gleam_point.create(
			'x', this.x - a1,
			'y', this.y - a2
		);
	}
};


/*
| Shortcut for point at 0/0.
*/
gleam_point.zero =
	gleam_point.create( 'x', 0, 'y', 0 );


} )( );
