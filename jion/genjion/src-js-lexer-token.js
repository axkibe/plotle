/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/
/*
| Export.
*/
var
	jsLexer =
		jsLexer || { };


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
	Constructor =
		function(
			v_type, // the token type
			v_value // the token value
		)
	{
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
var
	prototype =
		Constructor.prototype;

/*
| Jion.
*/
var
	token =
	jsLexer.token =
		{
			prototype :
				prototype
		};

/*
| Creates a new token object.
*/
token.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_type,

		v_value;

	if( this !== token )
	{
		inherit = this;

		v_type = this.type;

		v_value = this.value;
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
| Name Reflection.
*/
prototype.reflectName = 'token';

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

	return this.type === obj.type && this.value === obj.value;
};

/*
| Node export.
*/
if( SERVER )
{
	module.exports = token;
}


}
)( );
