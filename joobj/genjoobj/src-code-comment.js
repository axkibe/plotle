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
		219873997;


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
var Comment =
Code.Comment =
	function(
		tag,
		v_content  // comment content
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
/**/				throw new Error(
/**/					'invalid argument: ' + arguments[ a ]
/**/				);
/**/			}
		}
	}

/**/if( CHECK )
/**/{
/**/
/**/	if( v_content === undefined )
/**/	{
/**/		throw new Error(
/**/			'undefined attribute content'
/**/		);
/**/	}
/**/
/**/	if( v_content === null )
/**/	{
/**/		throw new Error(
/**/			'content must not be null'
/**/		);
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
			_tag,
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
| Gets values by path.
*/
Comment.prototype.getPath =
	JoobjProto.getPath;


/*
| Checks for equal objects.
*/
Comment.prototype.equals =
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
		this.content.equals( obj.content )
	);
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Comment;
}


} )( );
