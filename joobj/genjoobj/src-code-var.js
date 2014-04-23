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
	JoobjProto =
		require( '../../src/joobj/proto' );

	Jools =
		require( '../../src/jools/jools' );
}


/*
| Constructor.
*/
var Var =
Code.Var =
	function(
		tag, // magic cookie
		v_name // the variable name
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.name =
		v_name;

	this._init( );

	Jools.immute( this );
};


/*
| Creates a new Var object.
*/
Var.Create =
Var.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_name;

	if( this !== Var )
	{
		inherit =
			this;

		v_name =
			this.name;
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
			case 'name' :

				if( arg !== undefined )
				{
					v_name =
						arg;
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

	if( inherit && v_name === inherit.name )
	{
		return inherit;
	}

	return new Var( 8833, v_name );
};


/*
| Reflection.
*/
Var.prototype.reflect =
	'Var';


/*
| Sets values by path.
*/
Var.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Var.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
Var.prototype.equals =
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

	return this.name === obj.name;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Var;
}


} )( );
