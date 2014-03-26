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
		19236947;


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
var FuncArg =
Code.FuncArg =
	function(
		tag,
		v_comment, // argument comment
		v_name     // argument name
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

	this.comment =
		v_comment;

	this.name =
		v_name;

	Jools.immute( this );
};


/*
| Creates a new FuncArg object.
*/
FuncArg.create =
FuncArg.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_comment,
		v_name;

	if( this !== FuncArg )
	{
		inherit =
			this;

		v_comment =
			this.comment;

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
			case 'comment' :

				if( arg !== undefined )
				{
					v_comment =
						arg;
				}

				break;

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
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}
		}
	}

	if( v_comment === undefined )
	{
		v_comment =
			null;
	}

/**/if( CHECK )
/**/{
/**/
/**/	if( v_comment === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute comment'
/**/		);
/**/	}
/**/
/**/	if( v_comment !== null )
/**/	{
/**/		if(
/**/			typeof( v_comment ) !== 'string'
/**/			&&
/**/			!( v_comment instanceof String )
/**/		)
/**/		{
/**/			throw new Error(
/**/				'type mismatch'
/**/			);
/**/		}
/**/	}
/**/
/**/	if( v_name === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute name'
/**/		);
/**/	}
/**/
/**/	if( v_name !== null )
/**/	{
/**/		if(
/**/			typeof( v_name ) !== 'string'
/**/			&&
/**/			!( v_name instanceof String )
/**/		)
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
		v_comment === inherit.comment
		&&
		v_name === inherit.name
	)
	{
		return inherit;
	}

	return (
		new FuncArg(
			_tag,
			v_comment,
			v_name
		)
	);
};


/*
| Reflection.
*/
FuncArg.prototype.reflect =
	'FuncArg';


/*
| Sets values by path.
*/
FuncArg.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path.
*/
FuncArg.prototype.getPath =
	JoobjProto.getPath;


/*
| Checks for equal objects.
*/
FuncArg.prototype.equals =
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
		this.comment === obj.comment
		&&
		this.name === obj.name
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		FuncArg;
}


} )( );
