/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast;


ast = ast || { };


var
	ast_astFail;


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
		v_message // the error message expression
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.message = v_message;

	jools.immute( this );
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


/*
| Jion.
*/
ast_astFail =
ast.astFail =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astFail;
}


/*
| Creates a new astFail object.
*/
ast_astFail.create =
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
		v_message;

	if( this !== ast_astFail )
	{
		inherit = this;

		v_message = this.message;
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
			case 'message' :

				if( arg !== undefined )
				{
					v_message = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( );
/**/			}
		}
	}

	if( v_message === undefined )
	{
		v_message = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_message === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_message === inherit.message )
	{
		return inherit;
	}

	return new Constructor( v_message );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.astFail';


/*
| Reflection_.
*/
prototype.reflect_ = 'ast_astFail';


/*
| Name Reflection.
*/
prototype.reflectName = 'astFail';


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

	return this.message === obj.message;
};


}
)( );
