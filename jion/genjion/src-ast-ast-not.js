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
	ast_astNot;


/*
| Imports.
*/
var
	jools,
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

	jion_proto = require( '../../src/jion/proto' );
}


/*
| Constructor.
*/
var
	Constructor;


Constructor =
	function(
		v_expr // the expression to negate
	)
{
	this.expr = v_expr;

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
ast_astNot =
ast.astNot =
	{
		prototype :
			prototype
	};


if( SERVER )
{
	module.exports = ast_astNot;
}


/*
| Creates a new astNot object.
*/
ast_astNot.create =
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
		v_expr;

	if( this !== ast_astNot )
	{
		inherit = this;

		v_expr = this.expr;
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
			case 'expr' :

				if( arg !== undefined )
				{
					v_expr = arg;
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
/**/}

	if( inherit && v_expr === inherit.expr )
	{
		return inherit;
	}

	return new Constructor( v_expr );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.astNot';


/*
| Name Reflection.
*/
prototype.reflectName = 'astNot';


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

	return this.expr === obj.expr;
};


}
)( );
