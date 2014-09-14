/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	ast =
		ast || { };


/*
| Imports.
*/
var
	JionProto,


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
	JionProto = require( '../../src/jion/proto' );

	jools = require( '../../src/jools/jools' );

	ast = { };

	ast.aBlock = require( '../../src/ast/a-block' );
}


/*
| Constructor.
*/
var Constructor =
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
	prototype =
		Constructor.prototype;


/*
| Jion.
*/
var
	aForIn =
	ast.aForIn =
		{
			prototype :
				prototype
		};


/*
| Creates a new aForIn object.
*/
aForIn.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_block,

		v_object,

		v_variable;

	if( this !== aForIn )
	{
		inherit = this;

		v_block = this.block;

		v_object = this.object;

		v_variable = this.variable;
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
/**/				throw new Error( 'invalid argument' );
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/	if( v_block === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute block' );
/**/	}
/**/
/**/	if( v_block === null )
/**/	{
/**/		throw new Error( 'attribute block must not be null.' );
/**/	}
/**/
/**/	if( v_block.reflectName !== 'aBlock' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/
/**/	if( v_object === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute object' );
/**/	}
/**/
/**/	if( v_object === null )
/**/	{
/**/		throw new Error( 'attribute object must not be null.' );
/**/	}
/**/
/**/	if( v_variable === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute variable' );
/**/	}
/**/
/**/	if( v_variable === null )
/**/	{
/**/		throw new Error( 'attribute variable must not be null.' );
/**/	}
/**/
/**/	if(
/**/		typeof( v_variable ) !== 'string'
/**/		&&
/**/		!( v_variable instanceof String )
/**/	)
/**/	{
/**/		throw new Error( 'type mismatch' );
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
prototype.reflect = 'ast.aForIn';


/*
| Name Reflection.
*/
prototype.reflectName = 'aForIn';


/*
| Sets values by path.
*/
prototype.setPath = JionProto.setPath;


/*
| Gets values by path
*/
prototype.getPath = JionProto.getPath;


/*
| Tests equality of object.
*/
Constructor.prototype.equals =
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
		this.block === obj.block
		&&
		this.object === obj.object
		&&
		this.variable === obj.variable
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aForIn;
}


} )( );
