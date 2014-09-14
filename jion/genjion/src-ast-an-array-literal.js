/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast =
		ast || { };


/*
| Imports.
*/
var
	JionProto,


	jools;


/*
| Capulse.
*/
( function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	JionProto = require( '../../src/jion/proto' );

	jools = require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var Constructor =
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
	prototype =
		Constructor.prototype;


/*
| Jion.
*/
var
	anArrayLiteral =
	ast.anArrayLiteral =
		{
			prototype :
				prototype
		};


/*
| Creates a new anArrayLiteral object.
*/
anArrayLiteral.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		key,

		rank,

		ranks,

		twig,

		twigDup;

	if( this !== anArrayLiteral )
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
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		var
			arg =
				arguments[ a + 1 ];

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
					throw new Error( 'key "' + key + '" already in use' );
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
					throw new Error( 'key "' + key + '" not in use' );
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
					throw new Error( 'key "' + key + '" already in use' );
				}

				if( rank < 0 || rank > ranks.length )
				{
					throw new Error( 'invalid rank' );
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
					throw new Error( 'key "' + arg + '" not in use' );
				}

				delete twig[ arg ];

				ranks.splice( ranks.indexOf( arg ), 1 );

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( 'invalid argument' );
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
prototype.reflect = 'ast.anArrayLiteral';


/*
| Name Reflection.
*/
prototype.reflectName = 'anArrayLiteral';


/*
| Sets values by path.
*/
prototype.setPath = JionProto.setPath;


/*
| Gets values by path
*/
prototype.getPath = JionProto.getPath;


/*
| Returns a twig by rank.
*/
prototype.atRank = JionProto.atRank;


/*
| Gets the rank of a key.
*/
Constructor.prototype.rankOf = JionProto.rankOf;


/*
| Creates a new unique identifier.
*/
Constructor.prototype.newUID = JionProto.newUID;


/*
| Tests equality of object.
*/
Constructor.prototype.equals =
	function( obj // object to compare to
) { return this === obj; };


/*
| Node export.
*/
if( SERVER )
{
	module.exports = anArrayLiteral;
}


} )( );
