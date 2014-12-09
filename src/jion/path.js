/*
| A path toward an entity in a tree.
|
| FUTURE make it a ray.
*/


var
	jion_path,
	jools;


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
		id :
			'jion_path',
		ray :
			[ 'String' ],
		equals :
			false
	};
}


/*
| Node imports.
*/
if( SERVER )
{
	jion_path = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );
}


/*
| Returns a path with key appended
*/
jools.lazyFunctionString(
	jion_path.prototype,
	'append',
	function( key )
	{
		return this.create( 'ray:append', key );
	}
);


/*
| Same as append but without caching.
*/
jion_path.prototype.appendNC =
	function( key )
{
	return this.create( 'ray:append', key );
};


/*
| Returns a path with the first items chopped of.
|
| FIXME cache
*/
jion_path.prototype.chop =
	function(
		n // if not undefined chop this amount of items;
		//// defaults to 1
	)
{
	var
		ray;

	if( n === 0 )
	{
		return this;
	}

	ray = this.ray.slice( );

	ray.shift( );

	if( n > 0 )
	{
		return this.create( 'ray:init', ray ).chop( n - 1 );
	}

	return this.create( 'ray:init', ray );
};



/*
| Returns a path with the last 'n' item(s) removed.
|
| FUTURE cache
*/
jion_path.prototype.shorten =
	function(
		n
	)
{
	var
		a,
		ray;

	ray = this.ray.slice( );

	if( n === undefined )
	{
		n = 1;
	}

/**/if( CHECK )
/**/{
/**/	if( n > this.length )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( n === this.length )
	{
		return jion_path.empty;
	}

	for( a = 0; a < n; a++ )
	{
		ray.pop( );
	}

	return this.create( 'ray:init', ray );
};


/*
| Returns a path limited to a specific length.
|
| FIXME cache
*/
jion_path.prototype.limit =
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
		return jion_path.empty;
	}


	return this.create( 'ray:init', this.ray.slice( 0, n ) );
};

/*
| Returns a path with the first item prepended.
|
| FIXME cache
*/
jion_path.prototype.prepend =
	function(
		key
	)
{
	var
		ray;

	ray = this.ray.slice( );

	ray.unshift( key );

	return this.create( 'ray:init', ray );
};


/*
| Returns true if this path is the same as another.
|
| FIXME this ought to be autocreated
*/
jion_path.prototype.equals =
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

	tp = this.ray,

	op = o.ray;

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
jion_path.prototype.subPathOf =
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
			throw new Error( 'subPathOf out of range' );
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
		if( this.ray[ a ] !== o.ray[ a ] )
		{
			return false;
		}
	}

	return true;
};


/*
| Turns the path to a string.
*/
jools.lazyValue(
	jion_path.prototype,
	'string',
	function( )
	{
		var
			a,
			aZ,
			b,
			ray;

		ray = this.ray,

		b = [ '[ '[ 0 ] ]; // FUTURE jshint bug

		for(
			a = 0, aZ = this.length;
			a < aZ;
			a++
		)
		{
			b.push(
				( a > 0 ?  ', ' : ' ' ),
				ray[ a ]
			);
		}

		b.push( ' ]' );

		return b.join( '' );
	}
);


/*
| CreateFromJSON
*/
jion_path.createFromJSON =
	function( json )
{
	// FIXME this is a dirty hack and ought to be removed.
	if( json.reflect_ === 'jion_path' )
	{
		return json;
	}

	if( !Array.isArray( json ) )
	{
		throw new Error( 'invalid JSON, path is no array' );
	}

	return jion_path.create( 'ray:init', json );
};


/*
| Jsonfy.
*/
jion_path.prototype.toJSON =
	function( )
{
	return this.ray;
};


/*
| Returns true is this path is empty.
*/
jools.lazyValue(
	jion_path.prototype,
	'isEmpty',
	function( )
	{
		return this.length === 0;
	}
);


/*
| An empty path.
*/
jion_path.empty = jion_path.create( 'ray:init', [ ] );


} )( );
