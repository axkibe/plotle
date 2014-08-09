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
		v_message // the error message expression
	)
	{
		this.message = v_message;

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
	aFail =
	ast.aFail =
		{
			prototype :
				prototype
		};


/*
| Creates a new aFail object.
*/
aFail.create =
prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,

		v_message;

	if( this !== aFail )
	{
		inherit = this;

		v_message = this.message;
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
			case 'message' :

				if( arg !== undefined )
				{
					v_message = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( 'invalid argument' );
/**/			}
		}
	}

	if( v_message === undefined )
	{
		v_message = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_message === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute message' );
/**/	}
/**/}

	if( inherit && v_message === inherit.message )
	{
		return inherit;
	}

	return new Constructor( v_message );
};


/*
| Reflection.
*/
prototype.reflect = 'aFail';


/*
| New Reflection.
*/
prototype.reflex = 'ast.aFail';


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
		this.message === obj.message
		||
		this.message !== null
		&&
		this.message.equals
		&&
		this.message.equals( obj.message )
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = aFail;
}


} )( );
