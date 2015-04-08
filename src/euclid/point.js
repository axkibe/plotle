/*
| A point in a 2D plane.
*/


var
	euclid_fixPoint,
	euclid_point,
	jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
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


if( SERVER )
{
	euclid_point = require( 'jion' ).this( module, 'source' );

	jools = require( '../jools/jools' );
}


/*
| Adds two points or x/y values, returns a new point.
*/
euclid_point.prototype.add =
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
| Subtracts a points (or x/y from this), returns new point
*/
euclid_point.prototype.sub =
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
| Creates a new point.
|
| However, this will look through a list of points to see if
| this point has already this x/y to save the creation of yet
| another object
|
| point.renew(x, y, p1, p2, p3, ...)
*/
euclid_point.renew =
	function(
		x,
		y
	)
{
	var
		a,
		aZ,
		p;

	for(
		a = 2, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		p = arguments[ a ];

		if(
			p
			&& p.reflect === 'euclid_point'
			&& p.x === x
			&& p.y === y
		)
		{
			return p;
		}
	}

	return euclid_point.create( 'x', x, 'y', y );
};


/*
| Creates a fix point anchored to this point.
*/
euclid_point.prototype.fixPoint =
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
| Shortcut for point at 0/0.
*/
euclid_point.zero = euclid_point.create( 'x', 0, 'y', 0 );


} )( );
