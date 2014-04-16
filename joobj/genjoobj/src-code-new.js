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
var New =
Code.New =
	function(
		tag, // magic cookie
		v_call // the constrcutor call
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 100475993 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.call =
		v_call;

	Jools.immute( this );
};


/*
| Creates a new New object.
*/
New.create =
New.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_call;

	if( this !== New )
	{
		inherit =
			this;

		v_call =
			this.call;
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
			case 'call' :

				if( arg !== undefined )
				{
					v_call =
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
/**/	if( v_call === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute call' );
/**/	}
/**/
/**/	if( v_call === null )
/**/	{
/**/		throw new Error( 'attribute call must not be null.' );
/**/	}
/**/
/**/	if( v_call.reflect !== 'Call' )
/**/	{
/**/		throw new Error( 'type mismatch' );
/**/	}
/**/}

	if(
		inherit
		&&
		v_call.equals(
			inherit.call
		)
	)
	{
		return inherit;
	}

	return (
		new New(
			100475993,
			v_call
		)
	);
};


/*
| Reflection.
*/
New.prototype.reflect =
	'New';


/*
| Sets values by path.
*/
New.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
New.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
New.prototype.equals =
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

	return this.call === obj.call;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		New;
}


} )( );
