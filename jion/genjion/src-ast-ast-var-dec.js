/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast_astVarDec;


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
		v_assign, // Assignment of variable
		v_name // variable name
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.assign = v_assign;

	this.name = v_name;

/**/if( CHECK )
/**/{
/**/	Object.freeze( this );
/**/}
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


/*
| Jion.
*/
ast_astVarDec =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astVarDec;
}


/*
| Creates a new astVarDec object.
*/
ast_astVarDec.create =
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
		v_assign,
		v_name;

	if( this !== ast_astVarDec )
	{
		inherit = this;

		v_assign = this.assign;

		v_name = this.name;
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
			case 'assign' :

				if( arg !== undefined )
				{
					v_assign = arg;
				}

				break;

			case 'name' :

				if( arg !== undefined )
				{
					v_name = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

	if( v_assign === undefined )
	{
		v_assign = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_assign === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_name === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_name === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		typeof( v_name ) !== 'string'
/**/		&&
/**/		!( v_name instanceof String )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		inherit
		&&
		v_assign === inherit.assign
		&&
		v_name === inherit.name
	)
	{
		return inherit;
	}

	return new Constructor( v_assign, v_name );
};


/*
| Reflection.
*/
prototype.reflect = 'ast_astVarDec';


/*
| Name Reflection.
*/
prototype.reflectName = 'astVarDec';


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

	return this.assign === obj.assign && this.name === obj.name;
};


}
)( );
