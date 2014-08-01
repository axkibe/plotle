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
		v_expr, // the expression to get the member of
		v_member // the members name
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

		this.member = v_member;

		this._init( );

		Jools.immute( this );
	};


/*
| Creates a new Dot object.
*/
var Dot =
Code.Dot =
	function(
		// free strings
	)
{
	var
		inherit,
		v_expr,
		v_member;

	if( this !== Dot )
	{
		inherit = this;

		v_expr = this.expr;

		v_member = this.member;
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

			case 'member' :

				if( arg !== undefined )
				{
					v_member = arg;
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
/**/
/**/	if( v_member === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute member' );
/**/	}
/**/
/**/	if( v_member === null )
/**/	{
/**/		throw new Error( 'attribute member must not be null.' );
/**/	}
/**/
/**/	if(
/**/		typeof( v_member ) !== 'string'
/**/		&&
/**/		!( v_member instanceof String )
/**/	)
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if(
		inherit
		&&
		v_expr === inherit.expr
		&&
		v_member === inherit.member
	)
	{
		return inherit;
	}

	return new Constructor( 8833, v_expr, v_member );
};


/*
| Prototype
*/
var
	prototype =
	Dot.prototype = Constructor.prototype;


Dot.Create = Constructor.prototype.Create = Dot;


/*
| Reflection.
*/
Constructor.prototype.reflect = 'Dot';


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

	return this.expr === obj.expr && this.member === obj.member;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = Dot;
}


} )( );
