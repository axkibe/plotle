/*
| Paths describe entities in a tree.
|
| Authors: Axel Kittenberger
*/


/*
| Import
*/
var
	Jools;


/*
| Exports
*/
var
	Path;


/*
| Capsule
*/
( function ( ) {
"use strict";


/*
| Node imports.
*/
if( typeof( window ) === 'undefined' )
{
	Jools =
		require( './jools' );
}


/*
| Constructs a new Path.
|
| model can be an array or another path or null
| arguments followed by master are appended to the path
*/
Path =
	function( model )
{
	var path;

	// if true the path needs to be copied
	var copy = arguments.length > 1;

	switch( model.constructor )
	{
		case Path  :

			path =
				copy ? model._path.slice( ) : model._path;

			break;

		case Array :

			path =
				copy ? model.slice( ) : model;

			break;

		case null :

			path = [ ];

			break;

		default :
			throw new Error( 'invalid path-model' );
	}

	var
		// length of model
		mlen =
			path.length,

		// appends additional arguments
		a =
			1,

		aZ =
			arguments.length;

	while(
		a < aZ &&
		arguments[ a ] !== '--' &&
		arguments[ a ] !== '++'
	)
	{
		var k =
			arguments[a];

		if( k < 0 )
		{
			k += mlen;
		}

		if( k < 0 )
		{
			throw new Error( 'invalid path key' );
		}

		checkValidPathArc( arguments[ a + 1 ] );

		path[ k ] =
			arguments[ a + 1 ];

		a += 2;
	}

	if( arguments[a] === '--' )
	{
		var s =
			arguments[ a + 1 ];

		path.splice( path.length - s, s );

		a += 2;
	}

	if( arguments[a] === '++' )
	{
		for( a++; a < aZ; a++ )
		{
			checkValidPathArc( arguments[ a ] );

			path[ path.length ] = arguments[ a ];
		}
	}

	Jools.immute( path );

	Jools.innumerable( this, '_path', path );

	Jools.immute( this );
};


/*
| Returns true if argument is a path
*/
Path.isPath =
	function( a )
{
	return a.constructor === Path;
};


/*
| Returns true is arc is a valid path arc.
*/
var checkValidPathArc =
	function(
		arc
	)
{
	if( !Jools.isString( arc ) )
	{
		throw new Error(
			'Path arc not a string'
		);
	}

	if( arc[ 0 ] === '_' )
	{
		throw new Error(
			'Path arcs must not begin with "_"'
		);
	}
};


/*
| Length of the path.
*/
Object.defineProperty(
	Path.prototype,
	'length',
	{
		get :
			function( )
			{
				return this._path.length;
			}
	}
);


/*
| Returns the arc at index i.
*/
Path.prototype.get =
	function( i )
{
	if( i < 0 )
	{
		i +=
			this._path.length;
	}

	if( i < 0 || i >= this._path.length )
	{
		throw new Error( 'invalid get' );
	}

	return this._path[ i ];
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
	if( !Jools.is( len ) )
	{
		len =
			this._path.length;
	}
	else
	{
		if( len < 0 )
		{
			len += this._path.length;
		}

		if( len < 0 )
		{
			throw new Error(
				'subPathOf out of range'
			);
		}
	}

	if( len > o._path.length )
	{
		return false;
	}

	for( var a = 0; a < len; a++)
	{
		if( this._path[ a ] !== o._path[ a ] )
		{
			return false;
		}
	}

	return true;
};


/*
| Turns the path to a String.
*/
Path.prototype.toString =
	function( )
{
	return '[' + this._path.toString() + ']';
};


/*
| Jsonfy.
*/
Path.prototype.toJSON =
	function( )
{
	return this._path;
};


Path.empty =
	new Path(
		[ ]
	);

/*
| Node export
*/
if( typeof( window ) === 'undefined' )
{
	module.exports =
		Path;
}

} )( );

