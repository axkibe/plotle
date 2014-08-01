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
		v_boolean // the boolean
	)
	{
/**/	if( CHECK )
/**/	{
/**/		if( tag !== 8833 )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		this.boolean = v_boolean;

		Jools.immute( this );
	};


/*
| Creates a new BooleanLiteral object.
*/
var BooleanLiteral =
Code.BooleanLiteral =
	function(
		// free strings
	)
{
	var
		inherit,
		v_boolean;

	if( this !== BooleanLiteral )
	{
		inherit = this;

		v_boolean = this.boolean;
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
			case 'boolean' :

				if( arg !== undefined )
				{
					v_boolean = arg;
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
/**/	if( v_boolean === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute boolean' );
/**/	}
/**/
/**/	if( v_boolean === null )
/**/	{
/**/		throw new Error( 'attribute boolean must not be null.' );
/**/	}
/**/
/**/	if( typeof( v_boolean ) !== 'boolean' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if( inherit && v_boolean === inherit.boolean )
	{
		return inherit;
	}

	return new Constructor( 8833, v_boolean );
};


/*
| Prototype
*/
var
	prototype =
	BooleanLiteral.prototype = Constructor.prototype;


BooleanLiteral.Create = Constructor.prototype.Create = BooleanLiteral;


/*
| Reflection.
*/
Constructor.prototype.reflect = 'BooleanLiteral';


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

	return this.boolean === obj.boolean;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = BooleanLiteral;
}


} )( );
