/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	jsLexer;


jsLexer = jsLexer || { };


var
	jsLexer_token;


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
		v_type, // the token type
		v_value // the token value
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.type = v_type;

	if( v_value !== undefined )
	{
		this.value = v_value;
	}

	this._init( );

	jools.immute( this );
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


/*
| Jion.
*/
jsLexer_token =
jsLexer.token =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = jsLexer_token;
}


/*
| Creates a new token object.
*/
jsLexer_token.create =
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
		v_type,
		v_value;

	if( this !== jsLexer_token )
	{
		inherit = this;

		v_type = this.type;

		v_value = this.value;
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
			case 'type' :

				if( arg !== undefined )
				{
					v_type = arg;
				}

				break;

			case 'value' :

				if( arg !== undefined )
				{
					v_value = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

	if( v_value === undefined )
	{
		v_value = undefined;
	}

/**/if( CHECK )
/**/{
/**/	if( v_type === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_type === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		typeof( v_type ) !== 'string'
/**/		&&
/**/		!( v_type instanceof String )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_value === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_type === inherit.type && v_value === inherit.value )
	{
		return inherit;
	}

	return new Constructor( v_type, v_value );
};


/*
| Reflection.
*/
prototype.reflect = 'jsLexer.token';


/*
| Reflection_.
*/
prototype.reflect_ = 'jsLexer_token';


/*
| Name Reflection.
*/
prototype.reflectName = 'token';


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

	return this.type === obj.type && this.value === obj.value;
};


}
)( );
