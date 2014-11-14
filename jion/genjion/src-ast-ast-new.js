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


/*
| Imports.
*/
var
	jion,


	jools,


	ast,


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

	ast = { };

	jion = { };

	ast.astCall = require( '../../src/ast/ast-call' );

	jion.proto = require( '../../src/jion/proto' );
}

/*
| Constructor.
*/
var
	Constructor =
		function(
			v_call // the constrcutor call
		)
	{
		this.call = v_call;

		jools.immute( this );
	};

/*
| Prototype shortcut
*/
var
	prototype;

prototype = Constructor.prototype;

/*
| Jion.
*/
var
	astNew =
	ast.astNew =
		{
			prototype :
				prototype
		};

/*
| Creates a new astNew object.
*/
astNew.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_call;

	if( this !== astNew )
	{
		inherit = this;

		v_call = this.call;
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
			case 'call' :

				if( arg !== undefined )
				{
					v_call = arg;
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
/**/	if( v_call === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_call === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_call.reflect !== 'ast.astCall' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( inherit && v_call.equals( inherit.call ) )
	{
		return inherit;
	}

	return new Constructor( v_call );
};

/*
| Reflection.
*/
prototype.reflect = 'ast.astNew';

/*
| Name Reflection.
*/
prototype.reflectName = 'astNew';

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

	return this.call.equals( obj.call );
};

/*
| Node export.
*/
if( SERVER )
{
	module.exports = astNew;
}


}
)( );
