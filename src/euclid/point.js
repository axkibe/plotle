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
	euclid_fixPoint,
	euclid_point;


/*
| Capsule
*/
( function( ) {
'use strict';


var prototype;


if( NODE )
{
	euclid_point = require( 'jion' ).this( module, 'source' );
}

prototype = euclid_point.prototype;


/*
| Adds two points or x/y values, returns a new point.
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
		if( a1 === 0 && a2 === 0 )
		{
			return this;
		}

		return euclid_point.create(
			'x', this.x + a1,
			'y', this.y + a2
		);
	}
};


/*
| Creates a fix point anchored to this point.
*/
prototype.fixPoint =
	function(
		x,
		y
	)
{
	return(
		euclid_fixPoint.create(
			'anchor', this,
			'x', x,
			'y', y
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
| Shortcut for point at 0/0.
*/
euclid_point.zero = euclid_point.create( 'x', 0, 'y', 0 );


} )( );
