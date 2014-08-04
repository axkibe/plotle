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
		v_assign, // Assignment of variable
		v_name // variable name
	)
	{
		this.assign = v_assign;

		this.name = v_name;

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
	VarDec =
	Code.VarDec =
		{
			prototype :
				Constructor.prototype
		};


/*
| Creates a new VarDec object.
*/
VarDec.create =
Constructor.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_assign,
		v_name;

	if( this !== VarDec )
	{
		inherit = this;

		v_assign = this.assign;

		v_name = this.name;
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
			case 'assign' :

				if( arg !== undefined )
				{
					v_assign = arg;
				}

				break;

			case 'name' :

				if( arg !== undefined )
				{
					v_name = arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error( 'invalid argument' );
/**/			}
		}
	}

	if( v_assign === undefined )
	{
		v_assign = null;
	}

/**/if( CHECK )
/**/{
/**/	if( v_assign === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute assign' );
/**/	}
/**/
/**/	if( v_name === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute name' );
/**/	}
/**/
/**/	if( v_name === null )
/**/	{
/**/		throw new Error( 'attribute name must not be null.' );
/**/	}
/**/
/**/	if(
/**/		typeof( v_name ) !== 'string'
/**/		&&
/**/		!( v_name instanceof String )
/**/	)
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if(
		inherit
		&&
		v_assign === inherit.assign
		&&
		v_name === inherit.name
	)
	{
		return inherit;
	}

	return new Constructor( v_assign, v_name );
};


/*
| Reflection.
*/
prototype.reflect = 'VarDec';


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
		(
			this.assign === obj.assign
			||
			this.assign !== null
			&&
			this.assign.equals
			&&
			this.assign.equals( obj.assign )
		)
		&&
		this.name === obj.name
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = VarDec;
}


} )( );
