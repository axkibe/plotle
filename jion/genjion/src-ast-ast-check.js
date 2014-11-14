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
	Constructor =
		function(
			v_block // the code block
		)
	{
		this.block = v_block;

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
	astCheck =
	ast.astCheck =
		{
			prototype :
				prototype
		};

/*
| Creates a new astCheck object.
*/
astCheck.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_block;

	if( this !== astCheck )
	{
		inherit = this;

		v_block = this.block;
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
			case 'block' :

				if( arg !== undefined )
				{
					v_block = arg;
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
/**/}

	if( inherit && v_block.equals( inherit.block ) )
	{
		return inherit;
	}

	return new Constructor( v_block );
};

/*
| Reflection.
*/
prototype.reflect = 'ast.astCheck';

/*
| Name Reflection.
*/
prototype.reflectName = 'astCheck';

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

	return this.block.equals( obj.block );
};

/*
| Node export.
*/
if( SERVER )
{
	module.exports = astCheck;
}


}
)( );
