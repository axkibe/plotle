/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast_objLiteral;


/*
| Imports.
*/
var
	jools,
	jion_proto;


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

	jion_proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var
	Constructor,
	prototype;


Constructor =
	function(
		twig, // twig
		ranks // twig ranks
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.twig = twig;

	this.ranks = ranks;

	if( FREEZE )
	{
		Object.freeze( twig );

		Object.freeze( ranks );

		Object.freeze( this );
	}
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


/*
| Jion.
*/
ast_objLiteral =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_objLiteral;
}


/*
| Creates a new objLiteral object.
*/
ast_objLiteral.create =
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

	if( this !== ast_objLiteral )
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

				if( twigDup !== true )
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

				if( twigDup !== true )
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

				if( twigDup !== true )
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

				if( twigDup !== true )
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

	if( inherit && twigDup === false )
	{
		return inherit;
	}

	return new Constructor( twig, ranks );
};


/*
| Reflection.
*/
prototype.reflect = 'ast_objLiteral';


/*
| Name Reflection.
*/
prototype.reflectName = 'objLiteral';


/*
| Sets values by path.
*/
prototype.setPath = jion_proto.setPath;


/*
| Gets values by path
*/
prototype.getPath = jion_proto.getPath;


/*
| Returns a twig by rank.
*/
prototype.atRank = jion_proto.twigAtRank;


/*
| Gets the rank of a key.
*/
jools.lazyFunctionString( prototype, 'rankOf', jion_proto.twigRankOf );


/*
| Gets the rank of a key.
*/
prototype.getKey = jion_proto.twigGetKey;


/*
| Returns the length of the twig.
*/
jools.lazyValue( prototype, 'length', jion_proto.twigLength );


/*
| Creates a new unique identifier.
*/
prototype.newUID = jion_proto.newUID;


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
