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

	ast.astBlock = require( '../../src/ast/ast-block' );

	jion.proto = require( '../../src/jion/proto' );
}

/*
| Constructor.
*/
var
	Constructor;

Constructor =
	function(
		v_block, // the for block
		v_object, // the object expression to iterate over
		v_variable // the loop variable
	)
{
	this.block = v_block;

	this.object = v_object;

	this.variable = v_variable;

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
	astForIn;

astForIn =
ast.astForIn =
	{
		prototype :
			prototype
	};

if( SERVER )
{
	module.exports = astForIn;
}

/*
| Creates a new astForIn object.
*/
astForIn.create =
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

		v_block,

		v_object,

		v_variable;

	if( this !== astForIn )
	{
		inherit = this;

		v_block = this.block;

		v_object = this.object;

		v_variable = this.variable;
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
			case 'block' :

				if( arg !== undefined )
				{
					v_block = arg;
				}

				break;

			case 'object' :

				if( arg !== undefined )
				{
					v_object = arg;
				}

				break;

			case 'variable' :

				if( arg !== undefined )
				{
					v_variable = arg;
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
/**/	if( v_block === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_block === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_block.reflect !== 'ast.astBlock' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_object === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_object === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_variable === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_variable === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if(
/**/		typeof( v_variable ) !== 'string'
/**/		&&
/**/		!( v_variable instanceof String )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		inherit
		&&
		v_block.equals( inherit.block )
		&&
		v_object === inherit.object
		&&
		v_variable === inherit.variable
	)
	{
		return inherit;
	}

	return new Constructor( v_block, v_object, v_variable );
};

/*
| Reflection.
*/
prototype.reflect = 'ast.astForIn';

/*
| Name Reflection.
*/
prototype.reflectName = 'astForIn';

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
		this.block.equals( obj.block )
		&&
		this.object === obj.object
		&&
		this.variable === obj.variable
	);
};


}
)( );
