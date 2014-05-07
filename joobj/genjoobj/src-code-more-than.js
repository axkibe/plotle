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
var MoreThan =
Code.MoreThan =
	function(
		tag, // magic cookie
		v_left, // left expression
		v_right // right expression
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 8833 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.left =
		v_left;

	this.right =
		v_right;

	Jools.immute( this );
};


/*
| Creates a new MoreThan object.
*/
MoreThan.Create =
MoreThan.prototype.Create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_left,
		v_right;

	if( this !== MoreThan )
	{
		inherit =
			this;

		v_left =
			this.left;

		v_right =
			this.right;
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
			case 'left' :

				if( arg !== undefined )
				{
					v_left =
						arg;
				}

				break;

			case 'right' :

				if( arg !== undefined )
				{
					v_right =
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
/**/	if( v_left === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute left' );
/**/	}
/**/
/**/	if( v_left === null )
/**/	{
/**/		throw new Error( 'attribute left must not be null.' );
/**/	}
/**/
/**/	if( v_right === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute right' );
/**/	}
/**/
/**/	if( v_right === null )
/**/	{
/**/		throw new Error( 'attribute right must not be null.' );
/**/	}
/**/}

	if( inherit && v_left === inherit.left && v_right === inherit.right )
	{
		return inherit;
	}

	return new MoreThan( 8833, v_left, v_right );
};


/*
| Reflection.
*/
MoreThan.prototype.reflect =
	'MoreThan';


/*
| Sets values by path.
*/
MoreThan.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
MoreThan.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
MoreThan.prototype.equals =
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

	return this.left === obj.left && this.right === obj.right;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		MoreThan;
}


} )( );
