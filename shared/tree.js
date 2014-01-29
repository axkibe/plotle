/*
| Meshcraft's basic data structure.
|
| Authors: Axel Kittenberger
*/


/*
| Imports
*/
var
	Jools,
	Path;


/*
| Exports
*/
var
	Tree =
		null;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Node imports
*/
if( SERVER )
{
	Jools =
		require( './jools' );

	Path =
		require( './path' );
}


Tree =
	function(
		tag,
		type,
		twig,
		ranks
	)
{
	if( tag !== 'TREE' )
	{
		throw new Error(
			'use grow instead of new'
		);
	}

	this.type =
		type;

	this.twig =
		twig;

	if( ranks )
	{
		this.ranks =
			ranks;
	}

	Jools.immute( this );
};


/*
| Gets the node a path leads to.
*/
Tree.prototype.getPath =
	function(
		path,
		shorten
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.reflect !== 'Path' )
/**/	{
/**/		throw new Error(
/**/			'not a path.'
/**/		);
/**/	}
/**/}

	if( shorten < 0 )
	{
		shorten +=
			path.length;
	}

	if( shorten < 0 )
	{
		throw new Error(
			'getPath invalid shorten'
		);
	}

	var
		aZ =
			Jools.is( shorten ) ? shorten : path.length,

		tree =
			this;

	for(
		var a = 0;
		a < aZ;
		a++
	)
	{
		if( !Jools.isnon( tree ) )
		{
			return null;
		}

		tree =
			tree.twig[ path.get( a ) ];
	}

	return tree;
};


/*
| Returns a tree where the node pointed by path is replaced by val.
*/
Tree.prototype.setPath =
	function(
		path,
		val,
		universe,
		shorten
	)
{
	if( path.reflect !== 'Path' )
	{
		throw new Error(
			'no path'
		);
	}

	if( shorten < 0 )
	{
		shorten +=
			path.length;
	}

	if( shorten < 0 )
	{
		throw new Error(
			'invalid shorten'
		);
	}

	var
		aZ =
		Jools.is( shorten ) ? shorten : path.length;

	for(
		var a = aZ - 1;
		a >= 0;
		a--
	)
	{
		var
			tree =
				this.getPath(
					path,
					a
				);

		val =
			universe.grow(
				tree,
				path.get( a ),
				val
			);
	}

	return val;
};


/*
| Returns the rank of the key
| That means it returns the index of key in the ranks array.
*/
Tree.prototype.rankOf =
	function(
		key
	)
{
	var
		ranks =
			this.ranks;

	if( !Jools.isArray( ranks ) )
	{
		throw new Error(
			'tree has no ranks'
		);
	}

	if( !Jools.isString( key ) )
	{
		throw new Error(
			'key no string'
		);
	}

	// checks ranking cache
	var
		rof =
			this._$rof;

	if( !rof )
	{
		Object.defineProperty(
			this,
			'_$rof',
			rof = { }
		);
	}

	var
		r =
			rof[ key ];

	if( Jools.is( r ) )
	{
		return r;
	}

	var
		rank =
		rof[ key ] =
			Jools.is( this.twig[ key ] ) ?
				ranks.indexOf( key ) :
				-1;

	return rank;
};


/*
| Returns length of the twig
*/
Jools.lazyFixate(
	Tree.prototype,
	'length',
	function( )
	{
		return this.ranks.length;
	}
);


/*
| Creates a new unique identifier
*/
Tree.prototype.newUID =
	function( )
{
	var
		u =
			Jools.uid( );

	return (
		( !Jools.is( this.twig[ u ] ) ) ?
			u :
			this.newUID( )
	);
};


/*
| Returns the tree type.
*/
Tree.getType =
	function( o )
{
	switch( o.constructor )
	{

		case Array :
			return 'Array';

		case Boolean :
			return 'Boolean';

		case Number :
			return 'Number';

		case String :
			return 'String';

		default :

			if( o.reflect )
			{
				return o.reflect;
			}

			// FIXME remove
			if( o.type )
			{
				return o.type;
			}

			return o.twig.type ;
	}
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Tree;
}

} )( );

