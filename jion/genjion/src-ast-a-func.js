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
	jion,


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
	jools = require( '../../src/jools/jools' );

	ast = { };

	jion = { };

	ast.astBlock = require( '../../src/ast/ast-block' );

	jion.proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var Constructor =
	function(
		twig, // twig
		ranks, // twig ranks
		v_block // function code
	)
	{
		this.block = v_block;

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
	aFunc =
	ast.aFunc =
		{
			prototype :
				prototype
		};


/*
| Creates a new aFunc object.
*/
aFunc.create =
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

		twigDup,

		v_block;

	if( this !== aFunc )
	{
		inherit = this;

		twig = inherit.twig;

		ranks = inherit.ranks;

		twigDup = false;

		v_block = this.block;
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
			case 'block' :

				if( arg !== undefined )
				{
					v_block = arg;
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

	if( v_block === undefined )
	{
		v_block = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_block === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_block !== null )
/**/	{
/**/		if( v_block.reflectName !== 'astBlock' )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/}

	if(
		inherit
		&&
		!twigDup
		&&
		(
			v_block === inherit.block
			||
			v_block && v_block.equals( inherit.block )
		)
	)
	{
		return inherit;
	}

	return new Constructor( twig, ranks, v_block );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.aFunc';


/*
| Name Reflection.
*/
prototype.reflectName = 'aFunc';


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
Constructor.prototype.rankOf = jion.proto.rankOf;


/*
| Creates a new unique identifier.
*/
Constructor.prototype.newUID = jion.proto.newUID;


/*
| Tests equality of object.
*/
Constructor.prototype.equals =
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
								this.twig[ key ].equals
?
				!this.twig[ key ].equals( obj.twig[ key ] )
:
				this.twig[ key ] !== obj.twig[ key ]( )
			)
			{
				return false;
			}
		}
	}

	return (
		this.block === obj.block
		||
		this.block !== null && this.block.equals( obj.block )
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aFunc;
}


} )( );
