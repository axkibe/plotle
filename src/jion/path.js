/*
| A path toward an entity in a tree.
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
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'Path',
		unit :
			'Jion',
		attributes :
			{
				'array' :
				{
					comment :
						'the ajax path',
					type :
						'Object',
					assign :
						null,
					defaultValue :
						undefined
				},

				'_sliced' :
				{
					comment :
						'true if the array is already sliced',
					type :
						'Boolean',
					assign :
						null,
					defaultValue :
						undefined
				}
			},
		init :
			[ 'array', '_sliced' ],
		node :
			true,
		equals :
			false
	};
}


/*
| Node imports.
*/
if( SERVER )
{
	Jools = require( '../jools/jools' );

	Jion.Path = require( '../jion/this' )( module );
}


var
	Path;

Path = Jion.Path;


/*
| Initializer.
*/
Path.prototype._init =
	function(
		array,
		_sliced
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		( !(array instanceof Array ) )
/**/	)
/**/	{
/**/		throw new Error(
/**/			'path array not an array'
/**/		);
/**/	}
/**/}

	if( _sliced !== true )
	{
		array = array.slice( );
	}

	this.length = array.length;

/**/if( CHECK )
/**/{
/**/	array = Object.freeze( array );
/**/}

	this._path = array;
};


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
		idx += this.length;
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
Path.prototype.Append =
	function(
		key
	)
{
	var
		arr;

	arr = this._path.slice( );

	arr.push( key );

	return (
		Path.Create(
			'array',
				arr,
			'_sliced',
				true
		)
	);
};


/*
| Same as append but without caching.
*/
Path.prototype.AppendNC =
	Path.prototype.Append;



/*
| Returns a path with the first items chopped of.
|
| FIXME cache
*/
Path.prototype.Chop =
	function(
		n // if not undefined chop this amount of items;
		//// defaults to 1
	)
{
	var
		arr;

	if( n === 0 )
	{
		return this;
	}

	arr = this._path.slice( );

	arr.shift( );

	if( n > 0 )
	{
		return (
			Path.Create(
				'array',
					arr,
				'_sliced',
					true
			)
			.Chop( n - 1 )
		);
	}

	return (
		Path.Create(
			'array',
				arr,
			'_sliced',
				true
		)
	);
};



/*
| Returns a path with the last 'n' item(s) removed.
|
| FIXME cache
*/
Path.prototype.Shorten =
	function(
		n
	)
{
	var
		arr;

	arr = this._path.slice( );

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
		arr.pop( );
	}

	return (
		Path.Create(
			'array',
				arr,
			'_sliced',
				true
		)
	);
};


/*
| Returns a path limited to a specific length.
|
| FIXME cache
*/
Path.prototype.Limit =
	function(
		n
	)
{
/**/if( CHECK )
/**/{
/**/	if( n > this.length || n < 0 )
/**/	{
/**/		throw new Error(
/**/			'invalid limit'
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


	return (
		Path.Create(
			'array',
				this._path.slice( 0, n ),
			'_sliced',
				true
		)
	);
};

/*
| Returns a path with the first item prepended.
|
| FIXME cache
| FIXME call Prepend
*/
Path.prototype.prepend =
	function(
		key
	)
{
	var
		arr;

	arr = this._path.slice( );

	arr.unshift( key );

	return (
		Path.Create(
			'array',
				arr,
			'_sliced',
				true
		)
	);
};


/*
| Returns a path with key indexed by i set
|
| Currently unused.
*/
Path.prototype.Set =
	function(
		idx,
		key
	)
{
	var
		arr;

	arr = this._path.slice( );

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

	arr[ idx ] = key;

	return (
		Path.Create(
			'array',
				arr,
			'_sliced',
				true
		)
	);
};


/*
| Returns true if this path is the same as another.
*/
Path.prototype.equals =
	function( o )
{
	var
		op,
		tp;

	if( !o )
	{
		return false;
	}

	if( this === o )
	{
		return true;
	}

	tp = this._path,

	op = o._path;

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
	var
		a;

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
		a = 0;
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
			a,
			aZ,
			b,
			path;

		path = this._path,

		b = [ '[ '[ 0 ] ]; // FUTURE jshint bug

		for(
			a = 0, aZ = this.length;
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
| CreateFromJSON
*/
Path.CreateFromJSON =
	function( json )
{
	// FIXME this is a dirty hack and ought to be removed.
	if( json.reflect === 'Path' )
	{
		return json;
	}

	if( !json instanceof Array )
	{
		throw new Error( 'invalid JSON, path is no array' );
	}

	return (
		Path.Create(
			'array',
				json
		)
	);
};


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
	Path.Create(
		'array',
			[ ],
		'_sliced',
			true
	);

/*
| Node export.
*/
if( SERVER )
{
	module.exports = Path;
}


} )( );
