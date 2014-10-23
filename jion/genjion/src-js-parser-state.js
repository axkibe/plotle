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
		v_pos, // current position in token ray
		v_prec, // current precedence
		v_tokens // ray of tokens to parse
	)
	{
		this.ast = v_ast;

		this.pos = v_pos;

		this.prec = v_prec;

		this.tokens = v_tokens;

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

		v_pos,

		v_prec,

		v_tokens;

	if( this !== state )
	{
		inherit = this;

		v_ast = this.ast;

		v_pos = this.pos;

		v_prec = this.prec;

		v_tokens = this.tokens;
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

			case 'pos' :

				if( arg !== undefined )
				{
					v_pos = arg;
				}

				break;

			case 'prec' :

				if( arg !== undefined )
				{
					v_prec = arg;
				}

				break;

			case 'tokens' :

				if( arg !== undefined )
				{
					v_tokens = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

	if( v_prec === undefined )
	{
		v_prec = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_ast === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_pos === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_pos === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		typeof( v_pos ) !== 'number'
/**/		||
/**/		Math.floor( v_pos ) !== v_pos
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_prec === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_prec !== null )
/**/	{
/**/		if(
/**/			typeof( v_prec ) !== 'number'
/**/			||
/**/			Math.floor( v_prec ) !== v_prec
/**/		)
/**/		{
/**/			throw new Error( );
/**/		}
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
/**/}

	if(
		inherit
		&&
		v_ast === inherit.ast
		&&
		v_pos === inherit.pos
		&&
		v_prec === inherit.prec
		&&
		v_tokens === inherit.tokens
	)
	{
		return inherit;
	}

	return new Constructor( v_ast, v_pos, v_prec, v_tokens );
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
		this.pos === obj.pos
		&&
		this.prec === obj.prec
		&&
		this.tokens === obj.tokens
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
