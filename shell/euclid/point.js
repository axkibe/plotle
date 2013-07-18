/*
|
| A Point in a 2D plane.
|
| Points are pseudo immutable objects.
|
| Authors: Axel Kittenberger
|
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
	Jools,
	shellverse,
	Tree;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
|
| Point(x, y) or
| Point(p)
*/
var
	Point =
	Euclid.Point =
		function(
			a1,
			a2,
			a3
		)
{
	switch( arguments.length )
	{
		case 1 :
			// TODO remove
			this.x =
				a1.x;

			this.y =
				a1.y;

			break;

		case 2 :
			// TODO remove

			this.x =
				a1;

			this.y =
				a2;

			break;

		case 3 :

			if( a1 !== 'TREE' )
			{
				throw new Error(
					'argument fail'
				);
			}

			Tree.call(
				this,
				'TREE',
				'Point',
				a2
			);

			this.x =
				a2.x;

			this.y =
				a2.y;

			break;

		default :

			throw new Error(
				'argument fail'
			);
	}

	this.type =
		'Point';

	Jools.immute( this );
};


/*
| Points are tree nodes.
*/
Jools.subclass(
	Point,
	Tree
);



/*
| Returns true if this point is equal to another.
*/
Point.prototype.equals =
	function(
		a1,
		a2
	)
{
	return (
		typeof( a1 ) === 'object' ?
			this.x === a1.x &&
			this.y === a1.y :
			this.x === a1   &&
			this.y === a2
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

		return Tree.grow(
			'Point',
			shellverse,
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

		return Tree.grow(
			'Point',
			shellverse,
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

		return Tree.grow(
			'Point',
			shellverse,
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

		return Tree.grow(
			'Point',
			shellverse,
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

	return Tree.grow(
		'Point',
		shellverse,
		'x',
			x,
		'y',
			y
	);
};

/*
| Shortcut for point at 0/0.
*/
Euclid.Point.zero =
	new Point(
		'TREE',
		{
			type :
				'Point',
			x :
				0,

			y :
				0
		},
		null
	);



} )( );
