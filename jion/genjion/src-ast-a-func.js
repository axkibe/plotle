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

	ast = { };

	ast.aBlock = require( '../../src/ast/a-block' );
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
/**/				if( CHECK )
/**/				{
/**/					throw new Error(
/**/						'key "'
/**/						+
/**/						key
/**/						+
/**/						'" already in use'
/**/					);
/**/				}

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
/**/				if( CHECK )
/**/				{
/**/					throw new Error(
/**/						'key "'
/**/						+
/**/						key
/**/						+
/**/						'" not in use'
/**/					);
/**/				}

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
/**/				if( CHECK )
/**/				{
/**/					throw new Error(
/**/						'key "'
/**/						+
/**/						key
/**/						+
/**/						'" already in use'
/**/					);
/**/				}

					throw new Error( );
				}

				if( rank < 0 || rank > ranks.length )
				{
/**/				if( CHECK )
/**/				{
/**/					throw new Error(
/**/						'invalid rank'
/**/					);
/**/				}

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
/**/				if( CHECK )
/**/				{
/**/					throw new Error(
/**/						'key "'
/**/						+
/**/						arg
/**/						+
/**/						'" not in use'
/**/					);
/**/				}

					throw new Error( );
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

	if( v_block === undefined )
	{
		v_block = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_block === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute block' );
/**/	}
/**/
/**/	if( v_block !== null )
/**/	{
/**/		if( v_block.reflectName !== 'aBlock' )
/**/		{
/**/			throw new Error( 'type mismatch' );
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

	return (
		this.tree === obj.tree
		&&
		this.ranks === obj.ranks
		&&
		(
			this.block === obj.block
			||
			this.block !== null
			&&
			this.block.equals
			&&
			this.block.equals( obj.block )
		)
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
