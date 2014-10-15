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
		v_expr // the expression to pre increment
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
	astPreIncrement =
	ast.astPreIncrement =
		{
			prototype :
				prototype
		};


/*
| Creates a new astPreIncrement object.
*/
astPreIncrement.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_expr;

	if( this !== astPreIncrement )
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
prototype.reflect = 'ast.astPreIncrement';


/*
| Name Reflection.
*/
prototype.reflectName = 'astPreIncrement';


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

	return this.expr === obj.expr;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = astPreIncrement;
}


} )( );
