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
	Euclid ||
	{ };


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
| Node includes.
*/
if( typeof( window ) === 'undefined' )
{
	Jools =
		require( '../jools' );
}


var
	_tag =
		'enemenemu';

/*
| Constructor.
*/
var
	Point =
	Euclid.Point =
		function(
			tag,
			x,
			y
		)
{
	if( tag !== _tag )
	{
		throw new Error(
			'argument fail'
		);
	}

	if( CHECK )
	{
		if( x === undefined )
		{
			throw new Error( 'invalid x' );
		}

		if( y === undefined )
		{
			throw new Error( 'invalid y' );
		}
	}

	this.x =
		x;

	this.y =
		y;

	Jools.immute( this );
};


/*
| Reflection.
*/
Point.prototype.reflect =
	'Point';

/*
| TODO Workaround this is an evil.
*/
Point.prototype._$grown =
	true;



/*
| Creator
*/
Point.create =
	function(
		// free strings
	)
{
	var
		inherit,
		x,
		y,
		json;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'json' :

				json =
					arguments[ a + 1 ];

				break;

			case 'x' :

				x =
					arguments[ a + 1 ];

				break;

			case 'y' :

				y =
					arguments[ a + 1 ];

				break;

		}
	}

	if( json )
	{
		if( x === undefined )
		{
			x =
				json.x;
		}

		if( y === undefined )
		{
			y =
				json.y;
		}
	}

	if( inherit )
	{
		if( x === undefined )
		{
			x =
				inherit.x;
		}

		if( y === undefined )
		{
			y =
				inherit.y;
		}
	}

	if(
		inherit
		&&
		x === inherit.x
		&&
		y === inherit.y
	)
	{
		return inherit;
	}

	return (
		new Point(
			_tag,
			x,
			y
		)
	);
};


/*
| Reflection.
*/
Point.prototype.reflect =
	'Point';


/*
| Returns true if this point is equal to another.
*/
Point.prototype.equals =
	function(
		p
	)
{
	return (
		this === p
		||
		(
			this.x === p.x
			&&
			this.y === p.y
		)
	);
};


/*
| Adds two points or x/y values, returns a new point.
*/
Point.prototype.add =
	function(
		a1,
		a2
	)
{
	if( typeof(a1) === 'object' )
	{
		if( a1.x === 0 && a1.y === 0 )
		{
			return this;
		}

		return Point.create(
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

		return Point.create(
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

		return Point.create(
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

		return Point.create(
			'x',
				this.x - a1,
			'y',
				this.y - a2
		);
	}
};


/*
| Turns the Point into a JSON.
| TODO this is a workarond only.
*/
Point.prototype.toJSON =
	function(

	)
{
	return {
		type :
			'Point',

		twig :
			{
				'x' :
					this.x,

				'y' :
					this.y
			}
	};
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

	return Point.create(
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
	Point.create(
		'x',
			0,
		'y',
			0
	);


/*
| Exports
*/
if( typeof( window ) === 'undefined' )
{
	module.exports =
	        Point;
}



} )( );
