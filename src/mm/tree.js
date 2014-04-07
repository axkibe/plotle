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
		require( '../jools/jools' );

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
		path
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

	if( arguments.length > 1 )
	{
		throw new Error(
			'arg mismatch'
		);
	}

	var
		tree =
			this;

	for(
		var a = 0, aZ = path.length;
		a < aZ;
		a++
	)
	{
		if( !Jools.isnon( tree ) )
		{
			return null;
		}

		if( tree.reflect )
		{
			// switches to new style
			return tree.getPath( path.chop( a ) );
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
		universe
	)
{
	if( path.reflect !== 'Path' )
	{
		throw new Error( );
	}

	if( arguments.length > 3 )
	{
		throw new Error( 'arg mismatch' );
	}

	if( path.length === 0 )
	{
		return val;
//		throw new Error( 'WTF?');
	}

	var
		a,
		aZ =
			path.length;

	for(
		a = aZ - 1;
		a >= 0;
		a--
	)
	{
		var
			tree =
				this.getPath(
					path.shorten( aZ - a )
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
		throw new Error( );
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
| The length of the twig.
*/
Jools.lazyValue(
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

