/*
| This is an autogenerated file.
|
| DO NOT EDIT!
*/


/*
| Export
*/
var
	Code =
		Code || { };


/*
| Imports
*/
var
	JoobjProto,
	Jools;


/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		161534916;


/*
| Node includes
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
var Fail =
Code.Fail =
	function(
		tag,
		v_message  // the error message
	)
{

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/}

	this.message =
		v_message;

	Jools.immute( this );
};


/*
| Creates a new Fail object.
*/
Fail.create =
Fail.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_message;

	if( this !== Fail )
	{
		inherit =
			this;

		v_message =
			this.message;
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
					v_message =
						arg;
				}

				break;

			default :

/**/			if( CHECK )
/**/			{
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}
		}
	}

	if( v_message === undefined )
	{
		v_message =
			null;
	}

/**/if( CHECK )
/**/{
/**/
/**/	if( v_message === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute message'
/**/		);
/**/	}
/**/
/**/	if( v_message !== null )
/**/	{
/**/		if( v_message.reflect !== 'Term' )
/**/		{
/**/			throw new Error(
/**/				'type mismatch'
/**/			);
/**/		}
/**/	}
/**/}

	if(
		inherit
		&&
		(
			v_message === inherit.message
			||
			(
				v_message
				&&
				v_message.equals( inherit.message )
			)
		)
	)
	{
		return inherit;
	}

	return (
		new Fail(
			_tag,
			v_message
		)
	);
};


/*
| Reflection.
*/
Fail.prototype.reflect =
	'Fail';


/*
| Sets values by path.
*/
Fail.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path.
*/
Fail.prototype.getPath =
	JoobjProto.getPath;


/*
| Checks for equal objects.
*/
Fail.prototype.equals =
	function(
		obj
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
			this.message === obj.message ||
			(
				this.message !== null
				&&
				this.message.equals( obj.message )
			)
		)
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Fail;
}


} )( );
