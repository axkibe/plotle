/*
| This is an auto generated file.
|
| DO NOT EDIT!
*/


/*
| Export.
*/
var
	Code =
		Code || { };


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
		tag, // magic cookie
		v_expr // the expression to negate
	)
	{
/**/	if( CHECK )
/**/	{
/**/		if( tag !== 8833 )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		this.expr = v_expr;

		Jools.immute( this );
	};


/*
| Creates a new Not object.
*/
var Not =
Code.Not =
	function(
		// free strings
	)
{
	var
		inherit,
		v_expr;

	if( this !== Not )
	{
		inherit = this;

		v_expr = this.expr;
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
			case 'expr' :

				if( arg !== undefined )
				{
					v_expr = arg;
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
/**/	if( v_expr === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute expr' );
/**/	}
/**/
/**/	if( v_expr === null )
/**/	{
/**/		throw new Error( 'attribute expr must not be null.' );
/**/	}
/**/}

	if( inherit && v_expr === inherit.expr )
	{
		return inherit;
	}

	return new Constructor( 8833, v_expr );
};


/*
| Prototype
*/
var
	prototype =
	Not.prototype = Constructor.prototype;


Not.Create = Constructor.prototype.Create = Not;


/*
| Reflection.
*/
Constructor.prototype.reflect = 'Not';


/*
| Sets values by path.
*/
Constructor.prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
Constructor.prototype.getPath = JoobjProto.getPath;


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

	return this.expr === obj.expr;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = Not;
}


} )( );
