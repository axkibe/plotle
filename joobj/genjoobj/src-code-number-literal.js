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
var NumberLiteral =
Code.NumberLiteral =
	function(
		tag, // magic cookie
		v_number // the number
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.number = v_number;

	Jools.immute( this );
};


/*
| Creates a new NumberLiteral object.
*/
NumberLiteral.Create =
NumberLiteral.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_number;

	if( this !== NumberLiteral )
	{
		inherit = this;

		v_number = this.number;
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
			case 'number' :

				if( arg !== undefined )
				{
					v_number = arg;
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
/**/	if( v_number === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute number' );
/**/	}
/**/
/**/	if( v_number === null )
/**/	{
/**/		throw new Error( 'attribute number must not be null.' );
/**/	}
/**/
/**/	if( typeof( v_number ) !== 'number' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if( inherit && v_number === inherit.number )
	{
		return inherit;
	}

	return new NumberLiteral( 8833, v_number );
};


/*
| Reflection.
*/
NumberLiteral.prototype.reflect = 'NumberLiteral';


/*
| Sets values by path.
*/
NumberLiteral.prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
NumberLiteral.prototype.getPath = JoobjProto.getPath;


/*
| Tests equality of object.
*/
NumberLiteral.prototype.equals =
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

	return this.number === obj.number;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = NumberLiteral;
}


} )( );
