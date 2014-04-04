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
var FuncArg =
Code.FuncArg =
	function(
		tag, // magic cookie
		v_comment, // argument comment
		v_name // argument name
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 383158829 )
/**/	{
/**/		throw new Error( );
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
/**/				throw new Error( 'invalid argument' );
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
/**/	if( v_comment === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute comment' );
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
/**/			throw new Error( 'type mismatch' );
/**/		}
/**/	}
/**/
/**/	if( v_name === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute name' );
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
/**/			throw new Error( 'type mismatch' );
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
			383158829,
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
| Gets values by path
*/
FuncArg.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
FuncArg.prototype.equals =
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
		this.comment === obj.comment
		&&
		this.name === obj.name
	);
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		FuncArg;
}


} )( );
