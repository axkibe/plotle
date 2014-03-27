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
		945981145;


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
var New =
Code.New =
	function(
		tag,
		v_call  // the constrcutor call
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
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/
/**/	if( v_call === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute call'
/**/		);
/**/	}
/**/
/**/	if( v_call === null )
/**/	{
/**/		throw new Error(
/**/			'call must not be null'
/**/		);
/**/	}
/**/	if( v_call.reflect !== 'Call' )
/**/	{
/**/		throw new Error(
/**/			'type mismatch'
/**/		);
/**/	}
/**/}

	if(
		inherit
		&&
		v_call.equals( inherit.call )
	)
	{
		return inherit;
	}

	return (
		new New(
			_tag,
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
| Gets values by path.
*/
New.prototype.getPath =
	JoobjProto.getPath;


/*
| Checks for equal objects.
*/
New.prototype.equals =
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
		this.call.equals( obj.call )
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		New;
}


} )( );
