/*
| A path toward an entity in a tree.
|
| FIXME make it a jiobj
|
| Authors: Axel Kittenberger
*/


/*
| Export.
*/
var
	Jion;

Jion = Jion || { };

/*
| Imports.
*/
var
	Jools;


/*
| Capsule
*/
( function ( ) {
"use strict";


/*
| Node imports.
*/
if( SERVER )
{
	Jools = require( '../jools/jools' );
}


var
	Path,
	_tag =
		'PATH-87085899';


/*
| Constructs a new Path.
|
| model can be an array or another path or null
| arguments followed by master are appended to the path
*/
Path =
Jion.Path =
	function(
		tag,
		_path
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'invalid tag'
/**/		);
/**/	}
/**/
/**/	if(
/**/		( !(_path instanceof Array ) )
/**/	)
/**/	{
/**/		throw new Error(
/**/			'invalid _path'
/**/		);
/**/	}
/**/}

	this.length = _path.length;

	this._path = Object.freeze( _path );

	Jools.immute( this );
};


/*
| Creates a new path
*/
Path.Create =
	function(
		// free strings
	)
{
	var
		p =
			null,

		a, aZ;

	switch( arguments[ 0 ] )
	{
		case 'array' :

			p = arguments[ 1 ].slice( );

/**/		if( CHECK )
/**/		{
/**/			if( arguments.length !== 2 )
/**/			{
/**/				throw new Error(
/**/					'too many arguments'
/**/				);
/**/			}
/**/		}

			break;

		case 'list' :

			p = [ ];

			for(
				a = 1, aZ = arguments.length;
				a < aZ;
				a++
			)
			{
				p[ a - 1 ] = arguments[ a ];
			}

			break;

		default :

			throw new Error(
				'invalid argument'
			);
	}

	return new Path( _tag, p );
};


/*
| Refletion.
*/
Path.prototype.reflect =
	'Path';


/*
| Returns the arc at index i.
|
| FIXME base indizes on strings instead of numbers
*/
Path.prototype.get =
	function(
		idx
	)
{
	if( idx < 0 )
	{
		idx +=
			this.length;
	}

/**/if( CHECK )
/**/{
/**/	if( idx < 0 || idx >= this.length )
/**/	{
/**/		throw new Error( 'invalid get: ' + idx );
/**/	}
/**/}

	return this._path[ idx ];
};


/*
| Returns a path with key appended
|
| FIXME cache
*/
Path.prototype.append =
	function(
		key
	)
{
	var
		p =
			this._path.slice( );

	p.push( key );

	return new Path( _tag, p );
};


/*
| Same as append but without caching.
*/
Path.prototype.appendNC =
	Path.prototype.append;



/*
| Returns a path with the first items chopped of.
|
| FIXME cache
*/
Path.prototype.chop =
	function(
		n // if not undefined chop this amount of items;
		//// defaults to 1
	)
{
	var
		p;

	if( n === 0 )
	{
		return this;
	}

	p = this._path.slice( );

	p.shift( );

	if( n > 0 )
	{
		return new Path( _tag, p ).chop( n - 1 );
	}

	return new Path( _tag, p );
};



/*
| Returns a path with the last 'n' item(s) removed.
|
| FIXME cache
*/
Path.prototype.shorten =
	function(
		n
	)
{
	var
		p;

	p = this._path.slice( );

	if( n === undefined )
	{
		n = 1;
	}

/**/if( CHECK )
/**/{
/**/	if( n > this.length )
/**/	{
/**/		throw new Error(
/**/			'invalid shorten'
/**/		);
/**/	}
/**/}

	if( n === this.length )
	{
		return Path.empty;
	}

	for(
		var a = 0;
		a < n;
		a++
	)
	{
		p.pop( );
	}

	return new Path( _tag, p );
};


/*
| Returns a path limited to a specific lenght.
*/
Path.prototype.limit =
	function(
		n
	)
{

/**/if( CHECK )
/**/{
/**/	if( n > this.length || n < 0 )
/**/	{
/**/		throw new Error(
/**/			'invalid shorten'
/**/		);
/**/	}
/**/}

	if( n === this.length )
	{
		return this;
	}

	if( n === 0 )
	{
		return Path.empty;
	}

	var
		p =
			this._path.slice( 0, n );

	return new Path( _tag, p );
};

/*
| Returns a path with the first item prepended.
|
| FIXME cache
*/
Path.prototype.prepend =
	function(
		key
	)
{
	var
		p =
			this._path.slice( );

	p.unshift( key );

	return new Path( _tag, p );
};


/*
| Returns a path with key indexed by i set
*/
Path.prototype.set =
	function(
		idx,
		key
	)
{
	var
		p =
			this._path.slice( );

	if( idx < 0 )
	{
		idx +=
			this.length;
	}

/**/if( CHECK )
/**/{
/**/	if( idx < 0 || idx >= this.length )
/**/	{
/**/		throw new Error( 'invalid get' );
/**/	}
/**/}

	p[ idx ] =
		key;

	return new Path( _tag, p );
};


/*
| Returns true if this path is the same as another.
*/
Path.prototype.equals =
	function( o )
{
	if( !o )
	{
		return false;
	}

	if( this === o )
	{
		return true;
	}

	var
		tp =
			this._path,

		op =
			o._path;

	if( tp.length !== op.length )
	{
		return false;
	}

	for( var k in tp )
	{
		if( tp[ k ] !== op[ k ] )
		{
			return false;
		}
	}

	return true;
};


/*
| True if this path is a subPath of another.
|
| FIXME: optimize by using local variables
*/
Path.prototype.subPathOf =
	function(
		o,     // the other path
		len    // the length of this path to consider.
	)
{
	if( len === undefined )
	{
		len = this.length;
	}
	else
	{
		if( len < 0 )
		{
			len += this.length;
		}

		if( len < 0 )
		{
			throw new Error(
				'subPathOf out of range'
			);
		}
	}

	if( len > o.length )
	{
		return false;
	}

	for(
		var a = 0;
		a < len;
		a++
	)
	{
		if( this._path[ a ] !== o._path[ a ] )
		{
			return false;
		}
	}

	return true;
};


/*
| Turns the path to a string.
*/
Jools.lazyValue(
	Path.prototype,
	'string',
	function( )
	{
		var
			path = this._path,

			b = [ '[ '[ 0 ] ]; // FIXME jshint bug

		for(
			var a = 0, aZ = this.length;
			a < aZ;
			a++
		)
		{
			b.push(
				( a > 0 ?  ', ' : ' ' ),
				path[ a ]
			);
		}

		b.push( ' ]' );

		return b.join( '' );
	}
);


/*
| Jsonfy.
*/
Path.prototype.toJSON =
	function( )
{
	return this._path;
};


/*
| Returns true is this path is empty.
*/
Jools.lazyValue(
	Path.prototype,
	'isEmpty',
	function( )
	{
		return this.length === 0;
	}
);


/*
| An empty path.
*/
Path.empty =
	new Path(
		_tag,
		[ ]
	);

/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Path;
}


} )( );
