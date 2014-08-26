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
	JoobjProto = require( '../../src/jion/proto' );

	jools = require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var Constructor =
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
	prototype =
		Constructor.prototype;


/*
| Jion.
*/
var
	aNot =
	ast.aNot =
		{
			prototype :
				prototype
		};


/*
| Creates a new aNot object.
*/
aNot.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_expr;

	if( this !== aNot )
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

	return new Constructor( v_expr );
};


/*
| Reflection.
*/
prototype.reflect = 'ast.aNot';


/*
| Name Reflection.
*/
prototype.reflectName = 'aNot';


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

	return this.expr === obj.expr;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aNot;
}


} )( );
