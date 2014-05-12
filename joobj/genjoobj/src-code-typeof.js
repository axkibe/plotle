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
var Typeof =
Code.Typeof =
	function(
		tag, // magic cookie
		v_expr // the expression to get the type of
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.expr =
		v_expr;

	Jools.immute( this );
};


/*
| Creates a new Typeof object.
*/
Typeof.Create =
Typeof.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_expr;

	if( this !== Typeof )
	{
		inherit =
			this;

		v_expr =
			this.expr;
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
					v_expr =
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

	return new Typeof( 8833, v_expr );
};


/*
| Reflection.
*/
Typeof.prototype.reflect =
	'Typeof';


/*
| Sets values by path.
*/
Typeof.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Typeof.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
Typeof.prototype.equals =
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
	module.exports =
		Typeof;
}


} )( );