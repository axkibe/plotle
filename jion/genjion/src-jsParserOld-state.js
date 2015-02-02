/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	jsParser_state;


if( SERVER )
{
	jsParser_state = module.exports;
}
else
{
	jsParser_state = { };
}


/*
| Imports.
*/
var
	jools,
	jion_proto,
	jsParser_tokenSpec;


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

	jsParser_tokenSpec = require( '../../src/jsParserOld/tokenSpec' );
}


/*
| Constructor.
*/
var
	Constructor,
	prototype;


Constructor =
	function(
		v_ast, // current ast entity
		v_pos, // current position in token ray
		v_spec, // current precedence spec
		v_tokens // ray of tokens to parse
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.ast = v_ast;

	this.pos = v_pos;

	this.spec = v_spec;

	this.tokens = v_tokens;

	if( FREEZE )
	{
		Object.freeze( this );
	}
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


jsParser_state.prototype = prototype;


/*
| Creates a new state object.
*/
jsParser_state.create =
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
		v_ast,
		v_pos,
		v_spec,
		v_tokens;

	if( this !== jsParser_state )
	{
		inherit = this;

		v_ast = this.ast;

		v_pos = this.pos;

		v_spec = this.spec;

		v_tokens = this.tokens;
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

			case 'spec' :

				if( arg !== undefined )
				{
					v_spec = arg;
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
/**/	if( v_spec === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_spec === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_spec.reflect !== 'jsParserOld_tokenSpec' )
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
/**/}

	if(
		inherit
		&&
		v_ast === inherit.ast
		&&
		v_pos === inherit.pos
		&&
		v_spec.equals( inherit.spec )
		&&
		v_tokens === inherit.tokens
	)
	{
		return inherit;
	}

	return new Constructor( v_ast, v_pos, v_spec, v_tokens );
};


/*
| Reflection.
*/
prototype.reflect = 'jsParserOld_state';


/*
| Name Reflection.
*/
prototype.reflectName = 'state';


/*
| Sets values by path.
*/
prototype.setPath = jion_proto.setPath;


/*
| Gets values by path
*/
prototype.getPath = jion_proto.getPath;


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

	if( obj.reflect !== 'jsParserOld_state' )
	{
		return false;
	}

	return (
		this.ast === obj.ast
		&&
		this.pos === obj.pos
		&&
		this.spec.equals( obj.spec )
		&&
		this.tokens === obj.tokens
	);
};


}
)( );
