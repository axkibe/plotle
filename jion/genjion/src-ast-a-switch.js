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
	JoobjProto,


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
	JoobjProto = require( '../../src/jion/proto' );

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
		v_defaultCase, // the default block
		v_statement // the statement expression
	)
	{
		this.defaultCase = v_defaultCase;

		this.statement = v_statement;

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
	aSwitch =
	ast.aSwitch =
		{
			prototype :
				prototype
		};


/*
| Creates a new aSwitch object.
*/
aSwitch.create =
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

		v_defaultCase,

		v_statement;

	if( this !== aSwitch )
	{
		inherit = this;

		twig = inherit.twig;

		ranks = inherit.ranks;

		twigDup = false;

		v_defaultCase = this.defaultCase;

		v_statement = this.statement;
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
			case 'defaultCase' :

				if( arg !== undefined )
				{
					v_defaultCase = arg;
				}

				break;

			case 'statement' :

				if( arg !== undefined )
				{
					v_statement = arg;
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

	if( v_defaultCase === undefined )
	{
		v_defaultCase = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_defaultCase === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute defaultCase' );
/**/	}
/**/
/**/	if( v_defaultCase !== null )
/**/	{
/**/		if( v_defaultCase.reflexName !== 'aBlock' )
/**/		{
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}
/**/
/**/	if( v_statement === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute statement' );
/**/	}
/**/
/**/	if( v_statement === null )
/**/	{
/**/		throw new Error( 'attribute statement must not be null.' );
/**/	}
/**/}

	if(
		inherit
		&&
		!twigDup
		&&
		(
			v_defaultCase === inherit.defaultCase
			||
			v_defaultCase && v_defaultCase.equals( inherit.defaultCase )
		)
		&&
		v_statement === inherit.statement
	)
	{
		return inherit;
	}

	return new Constructor( twig, ranks, v_defaultCase, v_statement );
};


/*
| Reflection.
*/
prototype.reflect = 'aSwitch';


/*
| New Reflection.
*/
prototype.reflex = 'ast.aSwitch';


/*
| Name Reflection.
*/
prototype.reflexName = 'aSwitch';


/*
| Sets values by path.
*/
prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
prototype.getPath = JoobjProto.getPath;


/*
| Returns a twig by rank.
*/
prototype.atRank = JoobjProto.atRank;


/*
| Gets the rank of a key.
*/
Constructor.prototype.rankOf = JoobjProto.rankOf;


/*
| Creates a new unique identifier.
*/
Constructor.prototype.newUID = JoobjProto.newUID;


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
			this.defaultCase === obj.defaultCase
			||
			this.defaultCase !== null
			&&
			this.defaultCase.equals
			&&
			this.defaultCase.equals( obj.defaultCase )
		)
		&&
		this.statement === obj.statement
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aSwitch;
}


} )( );