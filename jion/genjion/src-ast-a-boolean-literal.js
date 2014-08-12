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
		v_boolean // the boolean
	)
	{
		this.boolean = v_boolean;

		jools.immute( this );
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
	aBooleanLiteral =
	ast.aBooleanLiteral =
		{
			prototype :
				prototype
		};


/*
| Creates a new aBooleanLiteral object.
*/
aBooleanLiteral.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_boolean;

	if( this !== aBooleanLiteral )
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

	return new Constructor( v_boolean );
};


/*
| Reflection.
*/
prototype.reflect = 'aBooleanLiteral';


/*
| New Reflection.
*/
prototype.reflex = 'ast.aBooleanLiteral';


/*
| Name Reflection.
*/
prototype.reflexName = 'aBooleanLiteral';


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

	return this.boolean === obj.boolean;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aBooleanLiteral;
}


} )( );
