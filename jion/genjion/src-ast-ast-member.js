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

	jion = { };

	jion.proto = require( '../../src/jion/proto' );
}

/*
| Constructor.
*/
var
	Constructor =
		function(
			v_expr, // the expression to get the member of
			v_member // the members expression
		)
	{
		this.expr = v_expr;

		this.member = v_member;

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
	astMember =
	ast.astMember =
		{
			prototype :
				prototype
		};

/*
| Creates a new astMember object.
*/
astMember.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_expr,

		v_member;

	if( this !== astMember )
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
/**/				throw new Error( );
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/	if( v_expr === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_expr === null )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_member === undefined )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( v_member === null )
/**/	{
/**/		throw new Error( );
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

	return new Constructor( v_expr, v_member );
};

/*
| Reflection.
*/
prototype.reflect = 'ast.astMember';

/*
| Name Reflection.
*/
prototype.reflectName = 'astMember';

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

	return this.expr === obj.expr && this.member === obj.member;
};

/*
| Node export.
*/
if( SERVER )
{
	module.exports = astMember;
}


}
)( );
