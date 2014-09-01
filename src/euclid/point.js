/*
| A point in a 2D plane.
|
| Authors: Axel Kittenberger
*/


/*
| Exports
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
		id :
			'euclid.point',
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
	jools = require( '../jools/jools' );

	euclid.point = require( '../jion/this' )( module );
}


var
	point;

point = euclid.point;


/*
| Adds two points or x/y values, returns a new point.
*/
point.prototype.add =
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

		return point.create(
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

		return point.create(
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
point.prototype.sub =
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

		return point.create(
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

		return point.create(
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
| point.renew(x, y, p1, p2, p3, ...)
*/
point.renew =
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
			p instanceof point &&
			p.x === x &&
			p.y === y
		)
		{
			return p;
		}
	}

	return point.create(
		'x',
			x,
		'y',
			y
	);
};


/*
| Shortcut for point at 0/0.
*/
point.zero =
	point.create(
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
	module.exports = point;
}


} )( );
