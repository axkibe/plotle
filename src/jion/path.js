/*
| A path toward an entity in a tree.
|
| FIXME use less init
| FIXME  do not call anything "item"
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
			[ 'string' ]
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
		var
			result;

		result = this.create( 'ray:append', key );

		jools.aheadValue( result, 'shorten', this );

		return result;
	}
);


/*
| Same as append but without caching.
*/
jion_path.prototype.appendNC =
	function( key )
{
	var
		result;

	result = this.create( 'ray:append', key );

	jools.aheadValue( result, 'shorten', this );

	return result;
};


/*
| Returns a path with the first item chopped of.
*/
jools.lazyValue(
	jion_path.prototype,
	'chop',
	function( )
	{
		var
			result;

/**/	if( CHECK )
/**/	{
/**/		if( this.length === 0 )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		result = this.create( 'ray:remove', 0 );

		jools.aheadValue( result, 'prepend', this.ray[ 0 ] );

		return result;
	}
);



/*
| Returns a path with the last item removed.
|
| FIXME ahead value
*/
jools.lazyValue(
	jion_path.prototype,
	'shorten',
	function( )
	{
		var
			ray;

/**/	if( CHECK )
/**/	{
/**/		if( this.length === 0 )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		ray = this.ray.slice( );

		ray.pop( );

		return this.create( 'ray:init', ray );
	}
);


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
| Returns a path with an entry prepended.
*/
jools.lazyFunctionString(
	jion_path.prototype,
	'prepend',
	function( entry )
	{
		var
			result;

		result = this.create( 'ray:insert', 0, entry );

		jools.aheadValue( result, 'chop', this );

		return result;
	}
);


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

		b = [ '[ '[ 0 ] ]; // FIXME jshint bug

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
	if( json.reflect === 'jion_path' )
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
