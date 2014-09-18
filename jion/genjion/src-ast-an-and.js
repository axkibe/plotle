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
	jion,


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
	jools = require( '../../src/jools/jools' );

	jion = { };

	jion.proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var Constructor =
	function(
		v_left, // left expression
		v_right // right expression
	)
	{
		this.left = v_left;

		this.right = v_right;

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
	anAnd =
	ast.anAnd =
		{
			prototype :
				prototype
		};


/*
| Creates a new anAnd object.
*/
anAnd.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_left,

		v_right;

	if( this !== anAnd )
	{
		inherit = this;

		v_left = this.left;

		v_right = this.right;
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
			case 'left' :

				if( arg !== undefined )
				{
					v_left = arg;
				}

				break;

			case 'right' :

				if( arg !== undefined )
				{
					v_right = arg;
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
/**/	if( v_left === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute left' );
/**/	}
/**/
/**/	if( v_left === null )
/**/	{
/**/		throw new Error( 'attribute left must not be null.' );
/**/	}
/**/
/**/	if( v_right === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute right' );
/**/	}
/**/
/**/	if( v_right === null )
/**/	{
/**/		throw new Error( 'attribute right must not be null.' );
/**/	}
/**/}

	if( inherit && v_left === inherit.left && v_right === inherit.right )
	{
		return inherit;
	}

	return new Constructor( v_left, v_right );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.anAnd';


/*
| Name Reflection.
*/
prototype.reflectName = 'anAnd';


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

	return this.left === obj.left && this.right === obj.right;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = anAnd;
}


} )( );
