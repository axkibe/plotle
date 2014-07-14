/*
| A Point in a 2D plane.
|
| Authors: Axel Kittenberger
*/


/*
| Exports
*/
var
	Euclid;


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
| The jion definition
*/
if( JION )
{
	return {
		name :
			'Point',
		unit :
			'Euclid',
		attributes :
			{
				x :
					{
						comment :
							'x coordinate',
						json :
							true,
						type :
							'Number'
					},
				y :
					{
						comment :
							'y coordinate',
						json :
							true,
						type :
							'Number'
					}
			},
		node :
			true
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	Jools =
		require( '../jools/jools' );

	Euclid.Point =
		require( '../jion/this' )( module );
}


var
	Point;

Point =
	Euclid.Point;


/*
| Adds two points or x/y values, returns a new point.
*/
Point.prototype.add =
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

		return Point.Create(
			'x',
				this.x + a1.x,
			'y',
				this.y + a1.y
		);
	}
	else
	{
		if( a1 === 0 && a2 === 0 )
		{
			return this;
		}

		return Point.Create(
			'x',
				this.x + a1,
			'y',
				this.y + a2
		);
	}
};


/*
| Subtracts a points (or x/y from this), returns new point
*/
Point.prototype.sub =
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

		return Point.Create(
			'x',
				this.x - a1.x,
			'y',
				this.y - a1.y
		);
	}
	else
	{
		if( a1 === 0 && a2 === 0 )
		{
			return this;
		}

		return Point.Create(
			'x',
				this.x - a1,
			'y',
				this.y - a2
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
| Point.renew(x, y, p1, p2, p3, ...)
*/
Point.renew =
	function(
		x,
		y
	)
{
	for(
		var a = 2, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		var p =
			arguments[a];

		if(
			p instanceof Point &&
			p.x === x &&
			p.y === y
		)
		{
			return p;
		}
	}

	return Point.Create(
		'x',
			x,
		'y',
			y
	);
};


/*
| Shortcut for point at 0/0.
*/
Point.zero =
	Point.Create(
		'x',
			0,
		'y',
			0
	);


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Point;
}


} )( );
