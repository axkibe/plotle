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
	ast_astFor;


/*
| Imports.
*/
var
	jools,
	ast_astBlock,
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

	ast_astBlock = require( '../../src/ast/ast-block' );

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
		v_block, // the for block
		v_condition, // the continue condition
		v_init, // the initialization
		v_iterate // the iteration expression
	)
{
/**/if( CHECK )
/**/{
/**/	if( prototype.__lazy )
/**/	{
/**/		this.__lazy = { };
/**/	}
/**/}

	this.block = v_block;

	this.condition = v_condition;

	this.init = v_init;

	this.iterate = v_iterate;

	jools.immute( this );
};


/*
| Prototype shortcut
*/
prototype = Constructor.prototype;


/*
| Jion.
*/
ast_astFor =
ast.astFor =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astFor;
}


/*
| Creates a new astFor object.
*/
ast_astFor.create =
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
		v_condition,
		v_init,
		v_iterate;

	if( this !== ast_astFor )
	{
		inherit = this;

		v_block = this.block;

		v_condition = this.condition;

		v_init = this.init;

		v_iterate = this.iterate;
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

			case 'condition' :

				if( arg !== undefined )
				{
					v_condition = arg;
				}

				break;

			case 'init' :

				if( arg !== undefined )
				{
					v_init = arg;
				}

				break;

			case 'iterate' :

				if( arg !== undefined )
				{
					v_iterate = arg;
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
/**/	if( v_condition === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_condition === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_init === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_init === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_iterate === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_iterate === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if(
		inherit
		&&
		v_block.equals( inherit.block )
		&&
		v_condition === inherit.condition
		&&
		v_init === inherit.init
		&&
		v_iterate === inherit.iterate
	)
	{
		return inherit;
	}

	return new Constructor( v_block, v_condition, v_init, v_iterate );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.astFor';


/*
| Reflection_.
*/
prototype.reflect_ = 'ast_astFor';


/*
| Name Reflection.
*/
prototype.reflectName = 'astFor';


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

	return (
		this.block.equals( obj.block )
		&&
		this.condition === obj.condition
		&&
		this.init === obj.init
		&&
		this.iterate === obj.iterate
	);
};


}
)( );
