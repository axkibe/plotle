/*
| Answer of a pointingHover call.
|
| Containts the path of the component being hovered over
| As well the shape the cursor should get.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	HoverReply;


/*
| Imports
*/
var
	Jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| the JOOBJ definition.
*/
if( JOOBJ )
{
	return {

		name :
			'HoverReply',

		attributes :
			{
				cursor :
					{
						type :
							'String'
					},

				path :
					{
						type :
							'Path'
					}
			}
	};
}


if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}

var
	_tag =
		'HOVER-REPLY-16577377';


/*
| Constructor.
*/
HoverReply =
	function(
		tag,
		cursor,
		path
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}
	}

	this.path =
		path;

	this.cursor =
		cursor;

	Jools.immute( this );
};


/*
| Creates a new hover object.
*/
HoverReply.create =
	function(
		// free strings
	)
{
	var
		cursor =
			null,

		inherit =
			null,

		path =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'cursor' :

				cursor =
					arguments[ a + 1 ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument: '
				);
		}
	}

	if( inherit )
	{
		if( cursor === null )
		{
			cursor =
				inherit.cursor;
		}

		if( path === null )
		{
			path =
				inherit.path;
		}

		if(
			cursor === inherit.cursor
			&&
			path === inherit.path
		)
		{
			return inherit;
		}
	}

	return (
		new HoverReply(
			_tag,
			cursor,
			path
		)
	);
};


/*
| Reflection
*/
HoverReply.prototype.reflect =
	'HoverReply';


} )( );
