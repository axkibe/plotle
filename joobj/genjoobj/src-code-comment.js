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
var Comment =
Code.Comment =
	function(
		tag, // magic cookie
		v_content // comment content
	)
{
/**/if( CHECK )
/**/{
/**/	if( tag !== 767617387 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	this.content =
		v_content;

	Jools.immute( this );
};


/*
| Creates a new Comment object.
*/
Comment.create =
Comment.prototype.create =
	function(
		// free strings
	)
{
	var
		inherit,
		v_content;

	if( this !== Comment )
	{
		inherit =
			this;

		v_content =
			this.content;
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
			case 'content' :

				if( arg !== undefined )
				{
					v_content =
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
/**/	if( v_content === undefined )
/**/	{
/**/		throw new Error( 'undefined attribute content' );
/**/	}
/**/
/**/	if( v_content === null )
/**/	{
/**/		throw new Error( 'attribute content must not be null.' );
/**/	}
/**/}

	if(
		inherit
		&&
		v_content === inherit.content
	)
	{
		return inherit;
	}

	return (
		new Comment(
			767617387,
			v_content
		)
	);
};


/*
| Reflection.
*/
Comment.prototype.reflect =
	'Comment';


/*
| Sets values by path.
*/
Comment.prototype.setPath =
	JoobjProto.setPath;


/*
| Gets values by path
*/
Comment.prototype.getPath =
	JoobjProto.getPath;


/*
| Tests equality of object.
*/
Comment.prototype.equals =
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

	return this.content === obj.content;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Comment;
}


} )( );
