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
	JoobjProto,


	Jools;


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
	JoobjProto = require( '../../src/jion/proto' );

	Jools = require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var Constructor =
	function(
		v_block, // the for block
		v_condition, // the continue condition
		v_init, // the initialization
		v_iterate // the iteration expression
	)
	{
		this.block = v_block;

		this.condition = v_condition;

		this.init = v_init;

		this.iterate = v_iterate;

		Jools.immute( this );
	};


/*
| Prototype shortcut
*/
var
	prototype =
		Constructor.prototype;


/*
| Jion
*/
var
	aFor =
	ast.aFor =
		{
			prototype :
				prototype
		};


/*
| Creates a new aFor object.
*/
aFor.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_block,

		v_condition,

		v_init,

		v_iterate;

	if( this !== aFor )
	{
		inherit = this;

		v_block = this.block;

		v_condition = this.condition;

		v_init = this.init;

		v_iterate = this.iterate;
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
/**/	if( v_block.reflexName !== 'aBlock' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/
/**/	if( v_condition === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute condition' );
/**/	}
/**/
/**/	if( v_condition === null )
/**/	{
/**/		throw new Error( 'attribute condition must not be null.' );
/**/	}
/**/
/**/	if( v_init === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute init' );
/**/	}
/**/
/**/	if( v_init === null )
/**/	{
/**/		throw new Error( 'attribute init must not be null.' );
/**/	}
/**/
/**/	if( v_iterate === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute iterate' );
/**/	}
/**/
/**/	if( v_iterate === null )
/**/	{
/**/		throw new Error( 'attribute iterate must not be null.' );
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
prototype.reflect = 'aFor';


/*
| New Reflection.
*/
prototype.reflex = 'ast.aFor';


/*
| Name Reflection.
*/
prototype.reflexName = 'aFor';


/*
| Sets values by path.
*/
prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
prototype.getPath = JoobjProto.getPath;


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
		this.condition === obj.condition
		&&
		this.init === obj.init
		&&
		this.iterate === obj.iterate
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aFor;
}


} )( );
