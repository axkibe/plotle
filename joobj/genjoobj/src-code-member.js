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
	JoobjProto = require( '../../src/joobj/proto' );

	Jools = require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var Member =
Code.Member =
	function(
		tag, // magic cookie
		v_expr, // the expression to get the member of
		v_member // the members expression
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.expr = v_expr;

	this.member = v_member;

	Jools.immute( this );
};


/*
| Creates a new Member object.
*/
Member.Create =
Member.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_expr,
		v_member;

	if( this !== Member )
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

	return new Member( 8833, v_expr, v_member );
};


/*
| Reflection.
*/
Member.prototype.reflect = 'Member';


/*
| Sets values by path.
*/
Member.prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
Member.prototype.getPath = JoobjProto.getPath;


/*
| Tests equality of object.
*/
Member.prototype.equals =
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
	module.exports = Member;
}


} )( );
