/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast;


ast = ast || { };


var
	ast_astCommaList;


/*
| Imports.
*/
var
	jion,
	jools,
	jion;


/*
| Capsule
*/
(
function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../../src/jools/jools' );

	jion = { };

	jion.proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var
	Constructor;


Constructor =
	function(
		twig, // twig
		ranks // twig ranks
	)
{
	this.twig = twig;

	this.ranks = ranks;

	jools.immute( this );

	jools.immute( twig );

	jools.immute( ranks );
};


/*
| Prototype shortcut
*/
var
	prototype;


prototype = Constructor.prototype;


/*
| Jion.
*/
var
	astCommaList;


astCommaList =
ast_astCommaList =
ast.astCommaList =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = astCommaList;
}


/*
| Creates a new astCommaList object.
*/
astCommaList.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		a,
		aZ,
		arg,
		inherit,
		key,
		rank,
		ranks,
		twig,
		twigDup;

	if( this !== astCommaList )
	{
		inherit = this;

		twig = inherit.twig;

		ranks = inherit.ranks;

		twigDup = false;
	}
	else
	{
		twig = { };

		ranks = [ ];

		twigDup = true;
	}

	for(
		a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		arg = arguments[ a + 1 ];

		switch( arguments[ a ] )
		{
			case 'twig:add' :

				if( !twigDup )
				{
					twig = jools.copy( twig );

					ranks = ranks.slice( );

					twigDup = true;
				}

				key = arg;

				arg = arguments[ ++a + 1 ];

				if( twig[ key ] !== undefined )
				{
					throw new Error( );
				}

				twig[ key ] = arg;

				ranks.push( key );

				break;

			case 'twig:set' :

				if( !twigDup )
				{
					twig = jools.copy( twig );

					ranks = ranks.slice( );

					twigDup = true;
				}

				key = arg;

				arg = arguments[ ++a + 1 ];

				if( twig[ key ] === undefined )
				{
					throw new Error( );
				}

				twig[ key ] = arg;

				break;

			case 'twig:insert' :

				if( !twigDup )
				{
					twig = jools.copy( twig );

					ranks = ranks.slice( );

					twigDup = true;
				}

				key = arg;

				rank = arguments[ a + 2 ];

				arg = arguments[ a + 3 ];

				a += 2;

				if( twig[ key ] !== undefined )
				{
					throw new Error( );
				}

				if( rank < 0 || rank > ranks.length )
				{
					throw new Error( );
				}

				twig[ key ] = arg;

				ranks.splice( rank, 0, key );

				break;

			case 'twig:remove' :

				if( !twigDup )
				{
					twig = jools.copy( twig );

					ranks = ranks.slice( );

					twigDup = true;
				}

				if( twig[ arg ] === undefined )
				{
					throw new Error( );
				}

				delete twig[ arg ];

				ranks.splice( ranks.indexOf( arg ), 1 );

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/}

	if( inherit && !twigDup )
	{
		return inherit;
	}

	return new Constructor( twig, ranks );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.astCommaList';


/*
| Name Reflection.
*/
prototype.reflectName = 'astCommaList';


/*
| Sets values by path.
*/
prototype.setPath = jion.proto.setPath;


/*
| Gets values by path
*/
prototype.getPath = jion.proto.getPath;


/*
| Returns a twig by rank.
*/
prototype.atRank = jion.proto.atRank;


/*
| Gets the rank of a key.
*/
prototype.rankOf = jion.proto.rankOf;


/*
| Creates a new unique identifier.
*/
prototype.newUID = jion.proto.newUID;


/*
| Tests equality of object.
*/
prototype.equals =
	function(
		obj // object to compare to
	)
{
	var
		a,
		aZ,
		key;

	if( this === obj )
	{
		return true;
	}

	if( !obj )
	{
		return false;
	}

	if( this.tree !== obj.tree || this.ranks !== obj.ranks )
	{
		if( this.ranks.length !== obj.ranks.length )
		{
			return false;
		}

		for(
			a = 0, aZ = this.ranks.length;
			a < aZ;
			++a
		)
		{
			key = this.ranks[ a ];

			if(
				key !== obj.ranks[ a ]
				||
				(
					this.twig[ key ].equals
					? !this.twig[ key ].equals( obj.twig[ key ] )
					: this.twig[ key ] !== obj.twig[ key ]
				)
			)
			{
				return false;
			}
		}
	}

	return true;
};


}
)( );
