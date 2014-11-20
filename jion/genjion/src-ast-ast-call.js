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
	ast_astCall;


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
		ranks, // twig ranks
		v_func // the function to call
	)
{
	this.func = v_func;

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
ast_astCall =
ast.astCall =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astCall;
}


/*
| Creates a new astCall object.
*/
ast_astCall.create =
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
		twigDup,
		v_func;

	if( this !== ast_astCall )
	{
		inherit = this;

		twig = inherit.twig;

		ranks = inherit.ranks;

		twigDup = false;

		v_func = this.func;
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
			case 'func' :

				if( arg !== undefined )
				{
					v_func = arg;
				}

				break;

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
/**/	if( v_func === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_func === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && !twigDup && v_func === inherit.func )
	{
		return inherit;
	}

	return new Constructor( twig, ranks, v_func );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.astCall';


/*
| Name Reflection.
*/
prototype.reflectName = 'astCall';


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

	return this.func === obj.func;
};


}
)( );
