/*
| The tree is Meshcraft's basic data structure.
|
| Authors: Axel Kittenberger
|
| FIXME: integreate tree and twig to be only one thing
*/


/*
| Imports
*/
var
	Jools,
	Path,
	Twig;


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
"use strict";


/*
| Node imports
*/
if( typeof( window ) === 'undefined' )
{
	Jools =
		require( './jools' );

	Path =
		require( './path' );

	Twig =
		require( './twig' );
}


/*
| Constructor.
*/
Tree =
	function(
		root,
		verse
	)
{
	if( !Jools.isnon( verse ) )
	{
		throw new Error(
			'verse missing'
		);
	}

	this.verse =
		verse;

	this.root =
		new Twig(
			root,
			verse
		);
};


/*
| Returns the pattern for object o.
*/
Tree.prototype.getPattern =
	function( o )
{
	return this.verse[ Twig.getType( o ) ];
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
	if( !Path.isPath( path ) )
	{
		throw new Error( 'getPath not a path.' );
	}

	if( shorten < 0 )
	{
		shorten += path.length;
	}

	if( shorten < 0 )
	{
		throw new Error( 'getPath invalid shorten' );
	}

	var
		aZ =
			Jools.is( shorten ) ? shorten : path.length,

		twig =
			this.root;

	for( var a = 0; a < aZ; a++ )
	{
		if (!Jools.isnon(twig))
			{ return null; }

		if ( this.verse[ Twig.getType( twig ) ].copse )
		{
			twig =
				twig.copse [ path.get( a ) ];
		}
		else
		{
			twig =
				twig [ path.get( a ) ];
		}
	}

	return twig;
};


/*
| Returns a tree where the node pointed by path is replaced by val.
*/
Tree.prototype.setPath =
	function(
		path,
		val,
		shorten
	)
{
	if( !Path.isPath( path ) )
	{
		throw new Error( 'Tree.get no path' );
	}

	if( shorten < 0 )
	{
		shorten += path.length;
	}

	if( shorten < 0 )
	{
		throw new Error( 'getPath invalid shorten' );
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
			twig =
				this.getPath(
					path,
					a
				);

		val =
			new Twig(
				twig,
				this.verse,
				path.get( a ),
				val
			);
	}

	return (
		new Tree(
			val,
			this.verse
		)
	);
};


/*
| Node export
*/
if( typeof( window ) === 'undefined' )
{
	module.exports = Tree;
}

})( );

