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
		tag, // magic cookie
		v_content // comment content
	)
	{
/**/	if( CHECK )
/**/	{
/**/		if( tag !== 8833 )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		this.content = v_content;

		Jools.immute( this );
	};


/*
| Creates a new Comment object.
*/
var Comment =
Code.Comment =
	function(
		// free strings
	)
{
	var
		inherit,
		v_content;

	if( this !== Comment )
	{
		inherit = this;

		v_content = this.content;
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
					v_content = arg;
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

	if( inherit && v_content === inherit.content )
	{
		return inherit;
	}

	return new Constructor( 8833, v_content );
};


/*
| Prototype
*/
var
	prototype =
	Comment.prototype = Constructor.prototype;


Comment.Create = Constructor.prototype.Create = Comment;


/*
| Reflection.
*/
Constructor.prototype.reflect = 'Comment';


/*
| Sets values by path.
*/
Constructor.prototype.setPath = JoobjProto.setPath;


/*
| Gets values by path
*/
Constructor.prototype.getPath = JoobjProto.getPath;


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

	return this.content === obj.content;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = Comment;
}


} )( );
