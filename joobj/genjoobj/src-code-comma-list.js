/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	Code =
		Code || { };


/*
| Imports.
*/
var
	JoobjProto,
	Jools;


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
	JoobjProto = require( '../../src/joobj/proto' );

	Jools = require( '../../src/jools/jools' );

	Code = { };

	Code.And = require( '../../src/code/and' );

	Code.Assign = require( '../../src/code/assign' );

	Code.Call = require( '../../src/code/call' );

	Code.Func = require( '../../src/code/func' );

	Code.New = require( '../../src/code/new' );

	Code.ObjLiteral = require( '../../src/code/obj-literal' );

	Code.Or = require( '../../src/code/or' );

	Code.Var = require( '../../src/code/var' );
}


/*
| Constructor.
*/
var CommaList =
Code.CommaList =
	function(
		tag, // magic cookie
		twig, // twig
		ranks // twig ranks
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.twig = twig;

	this.ranks = ranks;

	Jools.immute( this );

	Jools.immute( twig );

	Jools.immute( ranks );
};


/*
| Creates a new CommaList object.
*/
CommaList.Create =
CommaList.prototype.Create =
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

	if( this !== CommaList )
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
					twig = Jools.copy( twig );

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
					twig = Jools.copy( twig );

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
					twig = Jools.copy( twig );

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
					twig = Jools.copy( twig );

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

	return new CommaList( 8833, twig, ranks );
};


/*
| Reflection.
*/
CommaList.prototype.reflect = 'CommaList';


/*
| Sets values by path.
*/
CommaList.prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
CommaList.prototype.getPath = JoobjProto.getPath;


/*
| Returns a twig by rank.
*/
CommaList.prototype.atRank = JoobjProto.atRank;


/*
| Gets the rank of a key.
*/
CommaList.prototype.rankOf = JoobjProto.rankOf;


/*
| Creates a new unique identifier.
*/
CommaList.prototype.newUID = JoobjProto.newUID;


/*
| Tests equality of object.
*/
CommaList.prototype.equals =
	function(
		obj // object to compare to
	)
{
	if( this === obj )
	{
		return true;
	}

	if( !obj )
	{
		return false;
	}

	return this.tree === obj.tree && this.ranks === obj.ranks;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = CommaList;
}


} )( );
