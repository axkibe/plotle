/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	jsParser =
		jsParser || { };


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

	jion = { };

	jion.proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var Constructor =
	function(
		v_ast, // current ast entity
		v_tokens, // ray of tokens to parse
		v_tpos // current position in token ray
	)
	{
		this.ast = v_ast;

		this.tokens = v_tokens;

		this.tpos = v_tpos;

		jools.immute( this );
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
	state =
	jsParser.state =
		{
			prototype :
				prototype
		};


/*
| Creates a new state object.
*/
state.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_ast,

		v_tokens,

		v_tpos;

	if( this !== state )
	{
		inherit = this;

		v_ast = this.ast;

		v_tokens = this.tokens;

		v_tpos = this.tpos;
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
			case 'ast' :

				if( arg !== undefined )
				{
					v_ast = arg;
				}

				break;

			case 'tokens' :

				if( arg !== undefined )
				{
					v_tokens = arg;
				}

				break;

			case 'tpos' :

				if( arg !== undefined )
				{
					v_tpos = arg;
				}

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
/**/	if( v_ast === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_tokens === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_tokens === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_tpos === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_tpos === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		typeof( v_tpos ) !== 'number'
/**/		||
/**/		Math.floor( v_tpos ) !== v_tpos
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		inherit
		&&
		v_ast === inherit.ast
		&&
		v_tokens === inherit.tokens
		&&
		v_tpos === inherit.tpos
	)
	{
		return inherit;
	}

	return new Constructor( v_ast, v_tokens, v_tpos );
};


/*
| Reflection.
*/
prototype.reflect = 'jsParser.state';


/*
| Name Reflection.
*/
prototype.reflectName = 'state';


/*
| Sets values by path.
*/
prototype.setPath = jion.proto.setPath;


/*
| Gets values by path
*/
prototype.getPath = jion.proto.getPath;


/*
| Tests equality of object.
*/
prototype.equals =
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
		this.ast === obj.ast
		&&
		this.tokens === obj.tokens
		&&
		this.tpos === obj.tpos
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = state;
}


} )( );
